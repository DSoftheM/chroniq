import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "../../../api/provider"
import { QueryName } from "./query-name"
import { Period } from "../types/period"
import dayjs from "dayjs"
import { Schedule } from "../types/schedule"
import { Lesson } from "../types/lesson"

export function useScheduleQuery(options?: { refetchOnMount?: boolean }) {
  const now = dayjs()
  const stepInDays = 10

  return useInfiniteQuery({
    initialPageParam: {
      start: now.add(-10, "day").unix() * 1000,
      end: now.add(10, "day").unix() * 1000,
    },
    getPreviousPageParam: (_firstPage: Schedule, _allPages, firstPageParam) => {
      return {
        start: firstPageParam.start,
        end: dayjs(firstPageParam.start).subtract(stepInDays, "day").unix() * 1000,
      }
    },
    getNextPageParam: (_lastPage: Schedule, _allPages, lastPageParam) => {
      return {
        start: lastPageParam.end,
        end: dayjs(lastPageParam.end).add(stepInDays, "day").unix() * 1000,
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
