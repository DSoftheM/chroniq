import React, { useRef, useState } from "react"
import styled from "styled-components"
import { LessonView } from "./lesson-view"
import { getPrevDay, getNextDay, toDateOnly, isToday, classesToDictionary } from "./lib"
import { useScheduleQuery } from "./api/use-schedule-query"
import { PlusOutlined } from "@ant-design/icons"
import { ContentPlaceholder } from "./content-placeholder"
import { CreateOrUpdateLessonModal } from "./create-or-update-lesson-modal"
import { DateTime } from "./types/lib"
import { CreateOrUpdateStudentModal } from "./create-or-update-student-modal"
import { Button, Flex } from "antd"
import { StudentCellView } from "./student-cell-view"
import { ScheduleItem } from "./types/schedule"
import { Student } from "./types/student"

const Table = styled.div<{ $studentsCount: number }>`
  display: grid;
  grid-template-columns: 200px repeat(${(props) => props.$studentsCount}, 1fr);
  gap: 10px;
  position: relative;

  & > * {
    border: 1px solid #000;
    padding: 5px;
  }
`

type SelectedLesson = {
  studentId: string
  lessonId: string | null
}

const AddLessonButton = styled(Button)`
  width: 100%;
  opacity: 0;
  transition: all 0.3s ease 0s;
`

const Cell = styled.div`
  display: flex;
  align-items: center;

  &:hover ${AddLessonButton} {
    opacity: 1;
  }

  & > * {
    flex: 1;
  }
`

const EmptyCell = styled.div``

function TableHeader({ items, onEdit, hide }: { items: ScheduleItem[]; onEdit: (s: Student) => void; hide?: boolean }) {
  return (
    <>
      <EmptyCell style={{ height: hide ? "0" : "auto" }} />

      {items.map(({ student }) => {
        return (
          <div style={{ height: hide ? "0" : "auto", overflow: "hidden" }}>
            <StudentCellView key={student.name} student={student} onEdit={() => onEdit(student)} />
          </div>
        )
      })}
    </>
  )
}

export function Main() {
  const [selectedLesson, setSelectedLesson] = useState<SelectedLesson | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null | "create">(null)
  const selectedDateRef = useRef<DateTime | undefined>(undefined)
  const scheduleQuery = useScheduleQuery()

  let today = getPrevDay(new Date())

  if (scheduleQuery.isPending) return <div>Загрузка...</div>
  if (scheduleQuery.isError) return <div>Ошибка {scheduleQuery.error.message}</div>
  if (!scheduleQuery.data?.items.length) return <ContentPlaceholder />

  return (
    <div style={{ padding: 20 }}>
      {selectedLesson && (
        <CreateOrUpdateLessonModal
          creationDate={selectedDateRef.current}
          close={() => setSelectedLesson(null)}
          lessonId={selectedLesson.lessonId}
          studentId={selectedLesson.studentId}
        />
      )}

      {selectedStudentId && (
        <CreateOrUpdateStudentModal
          close={() => setSelectedStudentId(null)}
          initialStudent={scheduleQuery.data.items.find(({ student }) => student.id === selectedStudentId)?.student}
        />
      )}

      <Table $studentsCount={scheduleQuery.data?.items.length ?? 0} style={{ position: "sticky" }}>
        <TableHeader items={scheduleQuery.data?.items ?? []} onEdit={(s) => setSelectedStudentId(s.id)} />
      </Table>

      <Table $studentsCount={scheduleQuery.data?.items.length ?? 0}>
        <TableHeader hide items={scheduleQuery.data?.items ?? []} onEdit={(s) => setSelectedStudentId(s.id)} />

        {Array.from({ length: 100 }).flatMap(() => {
          today = getNextDay(today)
          return (
            <React.Fragment key={toDateOnly(today)}>
              <div style={{ backgroundColor: isToday(today) ? "green" : "" }}>{toDateOnly(today)}</div>

              {scheduleQuery.data?.items.map(({ student, lessons }) => {
                const classes = classesToDictionary(lessons)
                const lessons2 = classes[toDateOnly(today)] ?? []
                const _today = new Date(today)

                return (
                  <React.Fragment key={student.name}>
                    <Cell>
                      <Flex gap={2} vertical>
                        {lessons2
                          .toSorted((x, y) => x.date - y.date)
                          .map((x) => {
                            return (
                              <LessonView
                                key={x.id}
                                lesson={x}
                                onEdit={() => setSelectedLesson({ studentId: student.id, lessonId: x.id })}
                              />
                            )
                          })}

                        <AddLessonButton
                          style={{ width: "100%" }}
                          variant="link"
                          color="green"
                          onClick={() => {
                            setSelectedLesson({ studentId: student.id, lessonId: null })
                            selectedDateRef.current = _today.getTime()
                          }}
                          icon={<PlusOutlined />}
                        >
                          Добавить занятие
                        </AddLessonButton>
                      </Flex>
                    </Cell>
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })}
      </Table>

      <Button type="primary" onClick={() => setSelectedStudentId("create")}>
        Добавить ученика
      </Button>
    </div>
  )
}
