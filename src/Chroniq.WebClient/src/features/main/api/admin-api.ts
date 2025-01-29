import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../api/provider"
import { QueryName } from "./query-name"

export function useDeleteAllLessonsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteAllLessons,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryName.ScheduleQuery] })
    },
  })
}

export function useDeleteStudentsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteAllStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryName.ScheduleQuery] })
    },
  })
}

export function useApplyMockDataMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.applyMockData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryName.ScheduleQuery] })
    },
  })
}
