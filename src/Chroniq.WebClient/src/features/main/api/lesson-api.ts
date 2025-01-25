import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../api/provider"
import { QueryName } from "./query-name"

type MutationOptions = {
  onSuccess?: () => void
}

export function useUpdateLessonMutation(options: MutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.updateLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryName.ScheduleQuery] })

      options.onSuccess?.()
    },
  })
}

export function useCreateLessonMutation(options: MutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryName.ScheduleQuery] })

      options.onSuccess?.()
    },
  })
}

export function useDeleteLessonMutation(options: MutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryName.ScheduleQuery] })

      options.onSuccess?.()
    },
  })
}
