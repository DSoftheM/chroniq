import { api } from "@/api/provider"
import { QueryName } from "./query-name"
import { useQuery } from "@tanstack/react-query"
import { DateTime } from "../types/lib"

export function useWorkCalendar() {
  const query = useQuery({
    queryKey: [QueryName.WorkCalendarQuery],
    queryFn: api.getWorkCalendar,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  function isHoliday(date: DateTime): boolean {
    if (!query.data) return false

    const _date = new Date(date)
    const month = _date.getMonth() + 1
    const holidays = query.data.months.find((m) => m.month === month)

    if (!holidays) return false

    return holidays.days
      .split(",")
      .map((x) => x.replaceAll("+", ""))
      .filter((x) => !x.includes("*"))
      .includes(_date.getDate().toString())
  }

  return { isHoliday }
}
