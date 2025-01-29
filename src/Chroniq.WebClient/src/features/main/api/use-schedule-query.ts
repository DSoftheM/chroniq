import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "../../../api/provider"
import { QueryName } from "./query-name"
import { Period } from "../types/period"
import dayjs from "dayjs"
import { Schedule } from "../types/schedule"
import { Lesson } from "../types/lesson"
import { DateTime } from "../types/lib"
import { toRoundedPeriod } from "../../../lib/date.lib"

export function useScheduleQuery(options?: { refetchOnMount?: boolean }) {
  const now = dayjs()
  const stepInDays = 10

  return useInfiniteQuery({
    initialPageParam: toRoundedPeriod({
      start: (now.add(-10, "day").unix() * 1000) as DateTime,
      end: (now.add(10, "day").unix() * 1000) as DateTime,
    }),
    getPreviousPageParam: (_firstPage: Schedule, _allPages, firstPageParam) => {
      return {
        start: (dayjs(firstPageParam.start).subtract(stepInDays, "day").unix() * 1000) as DateTime,
        end: (dayjs(firstPageParam.start).subtract(1, "second").unix() * 1000) as DateTime,
      }
    },
    getNextPageParam: (_lastPage: Schedule, _allPages, lastPageParam) => {
      return {
        start: (dayjs(lastPageParam.end).add(1, "second").unix() * 1000) as DateTime,
        end: (dayjs(lastPageParam.end).add(stepInDays, "day").unix() * 1000) as DateTime,
      }
    },
    select(data) {
      const d: Record<string, Lesson[]> = data.pages.reduce((acc, page) => {
        page.items.forEach((item) => {
          if (!acc[item.student.id]) acc[item.student.id] = []
          acc[item.student.id].push(...item.lessons)
        })
        return acc
      }, {} as Record<string, Lesson[]>)

      const studentIds = new Set(data.pages.flatMap(({ items }) => items.map(({ student }) => student.id)))

      return {
        pageParams: data.pageParams,
        pages: data.pages,
        items: [...studentIds].map((id) => ({
          student: data.pages[0].items.find(({ student }) => student.id === id)!.student,
          lessons: d[id],
        })),
      }
    },
    queryKey: [QueryName.ScheduleQuery],
    queryFn: (context) => api.getSchedule(context.pageParam as Period),
    ...options,
  })
}
