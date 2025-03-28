import { Button, Input, Form, Card, Typography, Alert, Col, Row } from "antd"
import { useState } from "react"
import { api } from "@/shared/api/provider"
import { nav } from "@/shared/lib/nav"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`

const StyledCard = styled(Card)`
  width: 550px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`

const Footer = styled.div`
  text-align: center;
  margin-top: 12px;
`

export const RegisterPage: React.FC = () => {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const navigate = useNavigate()

  const onFinish = async () => {
    setLoading(true)
    setError("")

    api
      .register(login, password)
      .then(() => navigate(nav.main))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  return (
    <Wrapper>
      <StyledCard>
        <Typography.Title level={2} style={{ textAlign: "center" }}>
          Chroniq - Регистрация
        </Typography.Title>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="login" label="Логин" required>
            <Input placeholder="Введите логин" onChange={(e) => setLogin(e.target.value)} value={login} />
          </Form.Item>

          <Form.Item name="password" label="Пароль" required>
            <Input.Password
              placeholder="Введите пароль"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Item>
          <PasswordRequirements password={password} />

          <Form.Item name="confirm" label="Подтвердите пароль" required>
            <Input.Password
              placeholder="Повторите пароль"
              onChange={(e) => setConfirm(e.target.value)}
              value={confirm}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            // disabled={!isPasswordValid(password) || password !== confirm}
          >
            Зарегистрироваться
          </Button>
        </Form>

        <Footer>
          <Button type="link" onClick={() => navigate(nav.login)}>
            Войти
          </Button>
        </Footer>
      </StyledCard>
    </Wrapper>
  )
}

const PasswordRequirements: React.FC<{ password: string }> = ({ password }) => {
  const isValidLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  return (
    <div style={{ marginBottom: 12 }}>
      <Row>
        <Col span={24}>
          {isValidLength ? (
            <CheckCircleOutlined style={{ color: "green", marginRight: 8 }} />
          ) : (
            <CloseCircleOutlined style={{ color: "red", marginRight: 8 }} />
          )}
          Должен быть минимум 8 символов
        </Col>
        <Col span={24}>
          {hasUppercase ? (
            <CheckCircleOutlined style={{ color: "green", marginRight: 8 }} />
          ) : (
            <CloseCircleOutlined style={{ color: "red", marginRight: 8 }} />
          )}
          Должен содержать хотя бы одну заглавную букву
        </Col>
        <Col span={24}>
          {hasNumber ? (
            <CheckCircleOutlined style={{ color: "green", marginRight: 8 }} />
          ) : (
            <CloseCircleOutlined style={{ color: "red", marginRight: 8 }} />
          )}
          Должен содержать хотя бы одну цифру
        </Col>
        <Col span={24}>
          {hasSpecialChar ? (
            <CheckCircleOutlined style={{ color: "green", marginRight: 8 }} />
          ) : (
            <CloseCircleOutlined style={{ color: "red", marginRight: 8 }} />
          )}
          Должен содержать хотя бы один специальный символ
        </Col>
      </Row>
    </div>
  )
}
