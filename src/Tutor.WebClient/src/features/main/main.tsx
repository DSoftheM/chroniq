import React, { useRef } from "react"
import styled from "styled-components"
import { LessonView } from "./lesson-view"
import { getPrevDay, getNextDay, toDateOnly, isToday, classesToDictionary } from "./lib"
import { useScheduleQuery } from "./api/use-schedule-query"
import { PlusOutlined } from "@ant-design/icons"
import { ContentPlaceholder } from "./content-placeholder"
import { CreateOrUpdateLessonModal } from "./create-or-update-lesson-modal"
import { DateTime } from "./types/lib"

const Table = styled.div<{ $studentsCount: number }>`
  display: grid;
  grid-template-columns: 200px repeat(${(props) => props.$studentsCount}, 1fr);
  gap: 10px;

  & > * {
    border: 1px solid #000;
  }
`

type SelectedLesson = {
  studentId: string
  lessonId: string | null
}

const EmptyCell = () => <div />

export function Main() {
  const [selectedLesson, setSelectedLesson] = React.useState<SelectedLesson | null>(null)
  const selectedDateRef = useRef<DateTime | undefined>(undefined)
  const scheduleQuery = useScheduleQuery()

  let today = getPrevDay(new Date())

  if (scheduleQuery.isPending) return <div>Загрузка...</div>
  if (scheduleQuery.isError) return <div>Ошибка {scheduleQuery.error.message}</div>
  if (!scheduleQuery.data?.items.length) return <ContentPlaceholder />

  return (
    <>
      {selectedLesson && (
        <CreateOrUpdateLessonModal
          creationDate={selectedDateRef.current}
          close={() => setSelectedLesson(null)}
          lessonId={selectedLesson.lessonId}
          studentId={selectedLesson.studentId}
        />
      )}
      <Table $studentsCount={scheduleQuery.data?.items.length ?? 0}>
        <EmptyCell />

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
              {scheduleQuery.data?.items.map(({ student, lessons }) => {
                const classes = classesToDictionary(lessons)
                const classItem = classes[toDateOnly(today)]
                const _today = new Date(today)

                return (
                  <React.Fragment key={student.name}>
                    {classItem ? (
                      <LessonView
                        lesson={classItem}
                        onEdit={() => setSelectedLesson({ studentId: student.id, lessonId: classItem.id })}
                      />
                    ) : (
                      <PlusOutlined
                        onClick={() => {
                          setSelectedLesson({ studentId: student.id, lessonId: null })
                          selectedDateRef.current = _today.getTime()
                        }}
                      />
                    )}
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })}
      </Table>
    </>
  )
}
