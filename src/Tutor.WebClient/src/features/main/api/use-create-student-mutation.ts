import { useMutation } from "@tanstack/react-query"
import { api } from "../../../api/provider"

export function useCreateStudentMutation() {
  return useMutation({
    mutationFn: api.createStudent,
  })
}
