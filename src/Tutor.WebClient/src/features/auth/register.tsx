import { Button, Input } from "antd"
import { useState } from "react"
import { api } from "../../api/provider"
import { nav } from "../../lib/nav"
import { useNavigate } from "react-router-dom"

export function Register() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  return (
    <div>
      <h1>Регистрация</h1>
      <Input placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} />
      <Input placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Input
        placeholder="Повторите пароль"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button
        onClick={() =>
          api
            .login(login, password)
            .then(() => navigate(nav.main.main))
            .catch((e) => setError(e.message))
        }
      >
        Регистрация
      </Button>
      {error && <p>{error}</p>}
    </div>
  )
}
