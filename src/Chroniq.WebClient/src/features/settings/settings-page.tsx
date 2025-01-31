import { Button, Flex, Form, Input, InputNumber, Switch } from "antd"
import { useState } from "react"
import { useSaveSettingsMutation } from "./use-save-settings-mutation"
import { TimeSpan } from "../main/types/lib"

export function SettingsPage() {
  const [telegramLogin, setTelegramLogin] = useState("")
  const [minutes, setMinutes] = useState(5)
  const [hours, setHours] = useState(0)
  const [enabled, setEnabled] = useState(false)

  const isValid = telegramLogin && minutes >= 1 && minutes <= 600 && hours <= 24

  const saveMutation = useSaveSettingsMutation()

  return (
    <Form layout="vertical">
      <Form.Item label="Включить уведомления">
        <Switch checked={enabled} onChange={setEnabled} />
      </Form.Item>
      <Form.Item label="Логин в телеграм" required>
        <Input
          placeholder="Логин в телеграм"
          prefix="@"
          value={telegramLogin}
          onChange={(e) => setTelegramLogin(e.target.value)}
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
            telegramLogin,
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

function toTimeSpan(hours: number, minutes: number): TimeSpan {
  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}` as TimeSpan
}
