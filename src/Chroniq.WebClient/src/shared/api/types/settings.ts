import { TimeSpan } from "@/features/main/types/lib"

export type Settings = {
  enableNotifications: boolean
  notifyIn: TimeSpan
  telegramChatId: number
}
