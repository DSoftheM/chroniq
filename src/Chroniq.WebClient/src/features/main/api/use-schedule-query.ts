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
        start: firstPageParam.start,
        end: (dayjs(firstPageParam.start).subtract(stepInDays, "day").unix() * 1000) as DateTime,
      }
    },
    getNextPageParam: (_lastPage: Schedule, _allPages, lastPageParam) => {
      const period = {
        start: lastPageParam.end,
        end: lastPageParam.end,
      }

      // console.log(
      //   `Before: ${dayjs(period.start).format("DD.MM.YYYY HH:mm:ss")}. After: ${dayjs(period.start)
      //     .add(10, "seconds")
      //     .format("DD.MM.YYYY HH:mm:ss")}`
      // )

      const x = {
        start: (dayjs(period.start).add(1, "seconds").unix() * 1000) as DateTime,
        end: (dayjs(period.end).add(stepInDays, "days").unix() * 1000) as DateTime,
      }

      // console.log(
      //   `Запрос с ${dayjs(x.start).format("DD.MM.YYYY HH:mm:ss")} по ${dayjs(x.end).format("DD.MM.YYYY HH:mm:ss")}`
      // )

      return {
        start: (dayjs(period.start).add(1, "second").unix() * 1000) as DateTime,
        end: (dayjs(period.end).add(stepInDays, "day").unix() * 1000) as DateTime,
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
