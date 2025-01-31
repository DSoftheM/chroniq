import { api } from "@/api/provider"
import { useMutation } from "@tanstack/react-query"

export function useSaveSettingsMutation() {
  return useMutation({
    mutationFn: api.saveSettings,
  })
}
