import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../api/provider"
import { QueryName } from "./query-name"

export function useChangeStudentOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.changeStudentsOrders,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryName.ScheduleQuery] }),
  })
}
