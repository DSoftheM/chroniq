import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../api/provider"
import { QueryName } from "./query-name"

export function useCreateStudentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryName.ScheduleQuery] }),
  })
}
