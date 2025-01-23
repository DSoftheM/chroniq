import styled from "styled-components"
import { Lesson } from "./types/lesson"
import { LessonStatus } from "./types/lesson-status"
import { EditOutlined } from "@ant-design/icons"

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
  classItem: Lesson
  onEdit: () => void
}

export function ClassItemView(props: Props) {
  function renderStatus() {
    if (props.classItem.status === LessonStatus.Completed) {
      if (props.classItem.paid) {
        return <Success>Оплачено</Success>
      } else {
        return <Error>Не оплачено</Error>
      }
    }

    if (props.classItem.status === LessonStatus.InProgress) {
      return <Warning>В процессе</Warning>
    }

    if (props.classItem.status === LessonStatus.Scheduled) {
      return <Info>Запланировано</Info>
    }
  }

  return (
    <div>
      {renderStatus()} <EditOutlined onClick={() => props.onEdit()} />{" "}
    </div>
  )
}
