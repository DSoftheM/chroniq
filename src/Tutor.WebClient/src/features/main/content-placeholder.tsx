import { PlusOutlined } from "@ant-design/icons"
import { Typography } from "antd"
import { useNavigate } from "react-router-dom"
import { nav } from "../../lib/nav"

export function ContentPlaceholder() {
  const navigate = useNavigate()
  return (
    <div>
      <Typography.Title>Список учеников пуст</Typography.Title>
      <Typography.Text>Добавьте ученика</Typography.Text>
      <PlusOutlined onClick={() => navigate(nav.createStudent)} />
    </div>
  )
}
