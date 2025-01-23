import { Button, Input } from "antd"
import { useState } from "react"
import { api } from "../../api/provider"
import { nav } from "../../lib/nav"
import { useNavigate } from "react-router-dom"

export function Login() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  return (
    <div>
      <h1>Вход</h1>
      <Input placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} />
      <Input placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button
        onClick={() =>
          api
            .login(login, password)
            .then(() => navigate(nav.main))
            .catch((e) => setError(e.message))
        }
      >
        Войти
      </Button>
      {error && <p>{error}</p>}
    </div>
  )
}
