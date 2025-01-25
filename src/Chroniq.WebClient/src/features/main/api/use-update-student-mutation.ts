import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../api/provider"
import { QueryName } from "./query-name"

export function useUpdateStudentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.updateStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryName.ScheduleQuery] }),
  })
}
