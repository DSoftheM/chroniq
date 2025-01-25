import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../api/provider"
import { QueryName } from "./query-name"

export function useUpdateLessonMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.updateLesson,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryName.ScheduleQuery] }),
  })
}

export function useCreateLessonMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createLesson,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryName.ScheduleQuery] }),
  })
}
