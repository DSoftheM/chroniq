import { useMutation } from "@tanstack/react-query"
import { api } from "../../../api/provider"

export function useUpdateStudentMutation() {
  return useMutation({
    mutationFn: api.createStudent,
  })
}
