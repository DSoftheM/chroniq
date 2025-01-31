import { TimeSpan } from "@/features/main/types/lib"

export type SaveSettingsData = {
  telegramLogin: string
  enableNotifications: boolean
  notifyIn: TimeSpan
}
