import { Button, Input, Form, Card, Typography, Alert } from "antd"
import { useState } from "react"
import { api } from "@/shared/api/provider"
import { nav } from "@/shared/lib/nav"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`

const StyledCard = styled(Card)`
  width: 350px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`

const Footer = styled.div`
  text-align: center;
  margin-top: 12px;
`

export function LoginPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const onFinish = async (values: { login: string; password: string }) => {
    setLoading(true)
    setError("")
    api
      .login(values.login, values.password)
      .then(() => navigate(nav.main))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  return (
    <Wrapper>
      <StyledCard>
        <Typography.Title level={2} style={{ textAlign: "center" }}>
          Chroniq
        </Typography.Title>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="login" label="Логин" required>
            <Input
              placeholder="Введите логин"
              value={login}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
            />
          </Form.Item>

          <Form.Item name="password" label="Пароль" required>
            <Input.Password
              placeholder="Введите пароль"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading} disabled={!login || !password}>
            Войти
          </Button>
        </Form>

        <Footer>
          <Button type="link" onClick={() => navigate(nav.register)}>
            Зарегистрироваться
          </Button>
        </Footer>
      </StyledCard>
    </Wrapper>
  )
}
