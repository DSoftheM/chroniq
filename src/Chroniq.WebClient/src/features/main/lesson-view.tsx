import styled from "styled-components"
import { Lesson } from "./types/lesson"
import { getLessonStatus, LessonStatus } from "./types/lesson-status"
import { CheckCircleOutlined, EditOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import { TimeSpan } from "./types/lib"
import { Space, Tooltip } from "antd"
import { useUpdateLessonMutation } from "./api/lesson-api"
import { useNotification } from "../../global/notification-provider"

const Cell = styled.div<{ status: LessonStatus; $paid: boolean }>`
  padding: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;

  background-color: ${(props) => {
    switch (props.status) {
      case LessonStatus.Completed:
        if (props.$paid) return props.theme.green
        return props.theme.red
      case LessonStatus.InProgress:
        return props.theme.yellow
      case LessonStatus.Scheduled:
        return props.theme.colorInfo
    }
  }};

  color: ${(props) => {
    switch (props.status) {
      case LessonStatus.Completed:
        return props.theme.colorLink
      case LessonStatus.InProgress:
        return "black"
      case LessonStatus.Scheduled:
        return "white"
    }
  }};
`

type Props = {
  lesson: Lesson
  onEdit: () => void
}

const CheckCircleOutlinedStyled = styled(CheckCircleOutlined)`
  transition: all 0.3s ease 0s;

  &:hover {
    color: #fff;
  }
`

export function LessonView(props: Props) {
  const status = getLessonStatus(props.lesson)
  const api = useNotification()

  const updateLessonMutation = useUpdateLessonMutation({
    onSuccess: () => {
      api.success({ message: `Успешно`, description: "Занятие обновлено", placement: "topRight" })
    },
  })

  function getText() {
    return `${dayjs(props.lesson.date).format("HH:mm")} - ${dayjs(props.lesson.date)
      .add(getMilliseconds(props.lesson.duration), "ms")
      .format("HH:mm")}`
  }

  return (
    <Cell status={status} $paid={props.lesson.paid}>
      {props.lesson.id}
      {getText()}{" "}
      <Space>
        {status === LessonStatus.Completed && !props.lesson.paid && (
          <Tooltip title="Занятие оплачено">
            <CheckCircleOutlinedStyled onClick={() => updateLessonMutation.mutate({ ...props.lesson, paid: true })} />
          </Tooltip>
        )}
        <EditOutlined onClick={() => props.onEdit()} />
      </Space>
    </Cell>
  )
}

function getMilliseconds(span: TimeSpan) {
  const [h, m] = span.split(":").map(Number)
  return h * 60 * 60 * 1000 + m * 60 * 1000
}
