import { api } from "@/shared/api/provider"
import { useMutation, useQuery } from "@tanstack/react-query"

export function useSaveSettingsMutation() {
  return useMutation({
    mutationFn: api.saveSettings,
  })
}

export function useGetSettingsQuery() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: api.getSettings,
  })
}
