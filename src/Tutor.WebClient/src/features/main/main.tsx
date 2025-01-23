import React, { useState } from "react"
import styled from "styled-components"
import { ClassItemView } from "./class-item-view"
import { Button } from "antd"
import { CreateOrUpdateStudentModal } from "./add-or-edit-student-modal"
import { getPrevDay, getNextDay, toDateOnly, isToday, classesToDictionary, uuid } from "./lib"
import { useScheduleQuery } from "./api/use-schedule-query"
import { PlusOutlined } from "@ant-design/icons"

const Table = styled.div<{ studentsCount: number }>`
  display: grid;
  grid-template-columns: 200px repeat(${(props) => props.studentsCount}, 1fr);
  gap: 10px;

  & > * {
    border: 1px solid #000;
  }
`

type SelectedLesson = null | {
  studentId: string
  lessonId: string | null
}

export function Main() {
  const scheduleQuery = useScheduleQuery()
  const [selectedLesson, setSelectedLesson] = useState<SelectedLesson>(null)

  const isModalOpen = Boolean(selectedLesson?.studentId) && Boolean(selectedLesson?.lessonId)
  let today = getPrevDay(new Date())
  const student = selectedLesson?.lessonId
    ? scheduleQuery.data?.items.find((item) => item.student.id === selectedLesson?.studentId)?.student
    : null

  return (
    <>
      <Table studentsCount={scheduleQuery.data?.items.length ?? 0}>
        <div hidden>empty cell</div>

        {scheduleQuery.data?.items.map(({ student }) => {
          return (
            <React.Fragment key={student.name}>
              <div>{student.name}</div>
            </React.Fragment>
          )
        })}

        {Array.from({ length: 10 }).flatMap(() => {
          today = getNextDay(today)
          return (
            <React.Fragment key={toDateOnly(today)}>
              <div style={{ backgroundColor: isToday(today) ? "green" : "" }}>{toDateOnly(today)}</div>
              {scheduleQuery.data?.items.map(({ student }) => {
                const classes = classesToDictionary(student.lessons)
                const classItem = classes[toDateOnly(today)]

                return (
                  <React.Fragment key={student.name}>
                    {classItem ? (
                      <ClassItemView
                        classItem={classItem}
                        onEdit={() => setSelectedLesson({ studentId: student.id, lessonId: classItem.id })}
                      />
                    ) : (
                      <div>
                        <PlusOutlined onClick={() => setSelectedLesson({ studentId: student.id, lessonId: null })} />
                        {/* <Button onClick={() => }>+</Button> */}
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })}
      </Table>
      <CreateOrUpdateStudentModal isModalOpen={isModalOpen} onClose={() => setSelectedLesson(null)} student={student} />
    </>
  )
}
