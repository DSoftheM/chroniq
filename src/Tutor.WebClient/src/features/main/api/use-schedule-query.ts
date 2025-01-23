import { useQuery } from "@tanstack/react-query"
import { api } from "../../../api/provider"
import { QueryName } from "./query-name"

export function useScheduleQuery() {
  return useQuery({
    queryKey: [QueryName.ScheduleQuery],
    queryFn: () => api.getSchedule(),
  })
}
