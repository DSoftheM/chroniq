import React, { useRef, useState } from "react"
import styled from "styled-components"
import { LessonView } from "./lesson-view"
import { toDateOnly, isToday, classesToDictionary } from "./lib"
import { useScheduleQuery } from "./api/use-schedule-query"
import { PlusOutlined } from "@ant-design/icons"
import { ContentPlaceholder } from "./content-placeholder"
import { CreateOrUpdateLessonModal } from "./create-or-update-lesson-modal"
import { DateTime } from "./types/lib"
import { CreateOrUpdateStudentModal } from "./create-or-update-student-modal"
import { Button, Flex, Space } from "antd"
import { StudentCellView } from "./student-cell-view"
import { ScheduleItem } from "./types/schedule"
import { Student } from "./types/student"
import { Lesson } from "./types/lesson"
import { Scroll } from "../../components/scroll"
import dayjs from "dayjs"
import { Period } from "./types/period"
import { useDeleteAllLessonsMutation } from "./api/admin-api"

const Table = styled(Scroll)<{ $studentsCount: number }>`
  display: grid;
  grid-template-columns: 200px repeat(${(props) => props.$studentsCount}, 1fr);
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

  &:hover ${AddLessonButton} {
    opacity: 1;
  }

  & > * {
    flex: 1;
  }
`

const DateCell = styled.div<{ $isToday: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => props.$isToday && `background-color: ${props.theme.green};`}
`

const EmptyCell = styled.div`
  padding: 0;
`

function TableHeader({ items, onEdit, hide }: { items: ScheduleItem[]; onEdit: (s: Student) => void; hide?: boolean }) {
  return (
    <>
      <EmptyCell style={{ height: hide ? "0" : "auto", border: "none" }} />

      {items.map(({ student }) => {
        return (
          <div style={{ height: hide ? "0" : "auto", overflow: "hidden", padding: 0, border: "none" }} key={student.id}>
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
  const scheduleItems = scheduleQuery.data?.items
  const deleteAllLessons = useDeleteAllLessonsMutation()

  if (scheduleQuery.isPending) return <div>Загрузка...</div>
  if (scheduleQuery.isError) return <div>Ошибка {scheduleQuery.error.message}</div>
  if (!scheduleItems?.length) return <ContentPlaceholder />

  const dict: { [studentId: string]: { [dateOnly: string]: Lesson[] } } = {}

  scheduleItems.forEach(({ student, lessons }) => {
    dict[student.id] = classesToDictionary(lessons)
  })

  const firstDay = dayjs((scheduleQuery.data.pageParams[0] as Period).start)
  const lastDay = dayjs((scheduleQuery.data.pageParams.at(-1) as Period).end)
  const days = Array.from({ length: lastDay.diff(firstDay, "day") + 1 }, (_, i) => firstDay.add(i, "day"))

  return (
    <div style={{ padding: 20, height: "100%", display: "flex", flexDirection: "column" }}>
      {selectedLesson && (
        <CreateOrUpdateLessonModal
          creationDate={selectedDateRef.current}
          close={() => setSelectedLesson(null)}
          student={scheduleItems.find(({ student }) => student.id === selectedLesson.studentId)!.student}
          initialLesson={
            selectedStudentId === "create"
              ? null
              : scheduleItems
                  .find(({ student }) => student.id === selectedLesson.studentId)
                  ?.lessons.find(({ id }) => id === selectedLesson.lessonId) ?? null
          }
        />
      )}

      {selectedStudentId && (
        <CreateOrUpdateStudentModal
          close={() => setSelectedStudentId(null)}
          initialStudent={scheduleItems.find(({ student }) => student.id === selectedStudentId)?.student}
        />
      )}

      <Space>
        <Button type="primary" onClick={() => setSelectedStudentId("create")}>
          Добавить ученика
        </Button>
        <Button onClick={() => deleteAllLessons.mutate()}>Удалить все занятия {deleteAllLessons.status}</Button>
      </Space>
      <Table $studentsCount={scheduleItems.length ?? 0} style={{ position: "sticky" }}>
        <TableHeader items={scheduleItems ?? []} onEdit={(s) => setSelectedStudentId(s.id)} />
      </Table>

      <Table
        $studentsCount={scheduleItems.length ?? 0}
        style={{ height: "100%", overflow: "auto" }}
        onReachEnd={() => scheduleQuery.hasNextPage && scheduleQuery.fetchNextPage()}
        onReachStart={() => scheduleQuery.hasPreviousPage && scheduleQuery.fetchPreviousPage()}
      >
        <TableHeader hide items={scheduleItems ?? []} onEdit={(s) => setSelectedStudentId(s.id)} />

        {days
          .map((x) => x.toDate().getTime())
          .map((today) => {
            return (
              <React.Fragment key={today}>
                <DateCell $isToday={isToday(today)}>{toDateOnly(today)}</DateCell>

                {scheduleItems.map(({ student }) => {
                  const lessons2 = dict[student.id]?.[toDateOnly(today)] ?? []

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
                              selectedDateRef.current = today
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
    </div>
  )
}
