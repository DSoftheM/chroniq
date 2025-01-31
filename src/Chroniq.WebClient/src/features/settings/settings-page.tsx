import { Button, Form, Input } from "antd"
import { useState } from "react"

export function SettingsPage() {
  const [login, setLogin] = useState("")

  return (
    <Form layout="vertical">
      <Form.Item label="Логин в телеграм">
        <Input placeholder="Логин в телеграм" prefix="@" value={login} onChange={(e) => setLogin(e.target.value)} />
      </Form.Item>
      <Button type="primary">Сохранить</Button>
    </Form>
  )
}
