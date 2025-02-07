import { TimeSpan } from "@/features/main/types/lib"

export type SaveSettingsData = {
  telegramChatId: string
  enableNotifications: boolean
  notifyIn: TimeSpan
}
