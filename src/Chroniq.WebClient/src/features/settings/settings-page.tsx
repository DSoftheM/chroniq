import { Button, Flex, Form, Input, InputNumber, Switch } from "antd"
import { useState } from "react"
import { useGetSettingsQuery, useSaveSettingsMutation } from "./use-save-settings-mutation"
import { TimeSpan } from "../main/types/lib"

export function SettingsPage() {
  const [telegramChatId, setTelegramChatId] = useState("")
  const [minutes, setMinutes] = useState(5)
  const [hours, setHours] = useState(0)
  const [enabled, setEnabled] = useState(false)

  const isValid = telegramChatId && minutes >= 1 && minutes <= 600 && hours <= 24

  const saveMutation = useSaveSettingsMutation()
  const settingsQuery = useGetSettingsQuery()

  if (settingsQuery.isLoading) {
    return null
  }

  return (
    <Form layout="vertical">
      <Form.Item label="Включить уведомления">
        <Switch checked={enabled} onChange={setEnabled} />
      </Form.Item>
      <Form.Item label="Chat ID в телеграм" required>
        <Input
          placeholder="Например, 260095664"
          value={telegramChatId}
          onChange={(e) => setTelegramChatId(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="За сколько отправлять уведомление">
        <Flex gap={12}>
          <InputNumber
            min={0}
            max={24}
            value={hours}
            onChange={(val) => setHours(val ?? 0)}
            suffix="ч"
            controls={false}
          />
          <InputNumber
            min={1}
            max={600}
            value={minutes}
            onChange={(val) => setMinutes(val ?? 0)}
            suffix="мин"
            controls={false}
          />
        </Flex>
      </Form.Item>
      <Button
        type="primary"
        disabled={!isValid}
        onClick={() =>
          saveMutation.mutate({
            telegramChatId,
            enableNotifications: enabled,
            notifyIn: toTimeSpan(hours, minutes),
          })
        }
      >
        Сохранить
      </Button>
    </Form>
  )
}

function toTimeSpan(hours: number, minutes: number, seconds = 0): TimeSpan {
  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}` as TimeSpan
}
