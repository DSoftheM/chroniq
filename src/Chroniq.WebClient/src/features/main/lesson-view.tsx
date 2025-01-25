import styled from "styled-components"
import { Lesson } from "./types/lesson"
import { getLessonStatus, LessonStatus } from "./types/lesson-status"
import { EditOutlined } from "@ant-design/icons"
import dayjs from "dayjs"

const Cell = styled.div<{ status: LessonStatus }>`
  padding: 5px;
  border-radius: 5px;

  background-color: ${(props) => {
    console.log(props.theme)

    switch (props.status) {
      case LessonStatus.Completed:
        return "green"
      case LessonStatus.InProgress:
        return "yellow"
      case LessonStatus.Scheduled:
        return props.theme.colorInfo
    }
  }};

  color: ${(props) => {
    switch (props.status) {
      case LessonStatus.Completed:
        return "white"
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

export function LessonView(props: Props) {
  const status = getLessonStatus(props.lesson)

  function getText() {
    if (status === LessonStatus.Completed) {
      if (props.lesson.paid) {
        return "Оплачено"
      } else {
        return "Не оплачено"
      }
    }

    if (status === LessonStatus.InProgress) {
      return "В процессе"
    }

    if (status === LessonStatus.Scheduled) {
      return `Запланировано на ${dayjs(props.lesson.date).format("HH:mm")}`
    }
  }

  return (
    <Cell status={status}>
      {getText()} <EditOutlined onClick={() => props.onEdit()} />
    </Cell>
  )
}
