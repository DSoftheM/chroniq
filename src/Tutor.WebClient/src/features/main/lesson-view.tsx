import styled from "styled-components"
import { Lesson } from "./types/lesson"
import { getLessonStatus, LessonStatus } from "./types/lesson-status"
import { EditOutlined } from "@ant-design/icons"
import dayjs from "dayjs"

const Cell = styled.div`
  padding: 5px;
`

const Success = styled(Cell)`
  background-color: green;
  color: white;
`

const Error = styled(Cell)`
  background-color: red;
  color: white;
`

const Warning = styled(Cell)`
  background-color: yellow;
  color: black;
`

const Info = styled(Cell)`
  background-color: blue;
  color: white;
`

type Props = {
  lesson: Lesson
  onEdit: () => void
}

export function LessonView(props: Props) {
  const status = getLessonStatus(props.lesson)

  function renderStatus() {
    if (status === LessonStatus.Completed) {
      if (props.lesson.paid) {
        return <Success>Оплачено</Success>
      } else {
        return <Error>Не оплачено</Error>
      }
    }

    if (status === LessonStatus.InProgress) {
      return <Warning>В процессе</Warning>
    }

    if (status === LessonStatus.Scheduled) {
      return <Info>Запланировано на {dayjs(props.lesson.date).format("HH:mm")}</Info>
    }
  }

  return (
    <div>
      {renderStatus()} <EditOutlined onClick={() => props.onEdit()} />{" "}
    </div>
  )
}
