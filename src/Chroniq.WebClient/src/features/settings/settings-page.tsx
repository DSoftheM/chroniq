import { Button, Flex, Form, Input, InputNumber, Switch } from "antd"
import { useEffect } from "react"
import { useGetSettingsQuery, useSaveSettingsMutation } from "./use-save-settings-mutation"
import { TimeSpan } from "../main/types/lib"
import { Settings } from "@/api/types/settings"
import { useImmer } from "use-immer"

export function SettingsPage() {
  const saveMutation = useSaveSettingsMutation()

  const settingsQuery = useGetSettingsQuery()
  const [settings, updateSettings] = useImmer<Settings | null>(null)

  useEffect(() => {
    if (settingsQuery.data) {
      updateSettings(settingsQuery.data)
    }
  }, [settingsQuery.data])

  if (settingsQuery.isPending) {
    return "Загрузка..."
  }

  if (settingsQuery.isError) {
    return `Ошибка ${settingsQuery.error.message}`
  }

  const { hours, minutes } = fromTimeSpan(settings?.notifyIn || "00:00:00")

  const isValid = settings?.telegramChatId && minutes >= 1 && minutes <= 60 && hours <= 24

  return (
    <Form layout="vertical">
      <pre>{JSON.stringify(settings, null, 2)}</pre>
      <Form.Item label="Включить уведомления">
        <Switch
          checked={settings?.enableNotifications}
          onChange={(enabled) => updateSettings({ ...settings!, enableNotifications: enabled })}
        />
      </Form.Item>
      <Form.Item label="Chat ID в телеграм" required>
        <Input
          placeholder="Например, 260095664"
          value={settings?.telegramChatId}
          onChange={(e) => updateSettings({ ...settings!, telegramChatId: Number(e.target.value) })}
        />
      </Form.Item>
      <Form.Item label="За сколько отправлять уведомление">
        <Flex gap={12}>
          <InputNumber
            min={0}
            max={24}
            value={hours}
            onChange={(val) => updateSettings({ ...settings!, notifyIn: toTimeSpan(val ?? 0, minutes) })}
            suffix="ч"
            controls={false}
          />
          <InputNumber
            min={1}
            max={60}
            value={minutes}
            onChange={(val) => updateSettings({ ...settings!, notifyIn: toTimeSpan(hours, val ?? 0) })}
            suffix="мин"
            controls={false}
          />
        </Flex>
      </Form.Item>
      <Button type="primary" disabled={!isValid} onClick={() => saveMutation.mutate(settings!)}>
        Сохранить
      </Button>
    </Form>
  )
}

function toTimeSpan(hours: number, minutes: number, seconds = 0): TimeSpan {
  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}` as TimeSpan
}

function fromTimeSpan(span: TimeSpan): { hours: number; minutes: number; seconds: number } {
  const [h, m, s] = span.split(":").map(Number)
  return { hours: h, minutes: m, seconds: s }
}
