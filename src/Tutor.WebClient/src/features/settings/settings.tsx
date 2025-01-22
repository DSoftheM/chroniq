import { Button, Input } from "antd"
import { useState } from "react"

export function Settings() {
  const [login, setLogin] = useState("")

  return (
    <>
      <h1>Настройки</h1>
      <Input placeholder="Логин в телеграм" prefix="@" value={login} onChange={(e) => setLogin(e.target.value)} />
      <Button>Сохранить</Button>
    </>
  )
}
