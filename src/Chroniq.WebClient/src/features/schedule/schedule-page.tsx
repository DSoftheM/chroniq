import React, { useRef, useState } from "react"
import { LessonView } from "../main/lesson-view"
import { toDateOnly, isToday, classesToDictionary } from "../main/lib"
import { useScheduleQuery } from "../main/api/use-schedule-query"
import { PlusOutlined } from "@ant-design/icons"
import { ContentPlaceholder } from "../main/content-placeholder"
import { CreateOrUpdateLessonModal } from "../main/create-or-update-lesson-modal"
import { DateTime } from "../main/types/lib"
import { CreateOrUpdateStudentModal } from "../main/create-or-update-student-modal"
import { Button, Flex, Space } from "antd"
import { Lesson } from "../main/types/lesson"
import dayjs from "dayjs"
import { Period } from "../main/types/period"
import { useApplyMockDataMutation, useDeleteAllLessonsMutation, useDeleteStudentsMutation } from "../main/api/admin-api"
import { S } from "../main/styled"
import { TableHeader } from "./table-header"
import { useIsArchiveRoute } from "./use-is-archive-route"

type SelectedLesson = {
  studentId: string
  lessonId: string | null
}

export function SchedulePage() {
  const [selectedLesson, setSelectedLesson] = useState<SelectedLesson | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null | "create">(null)
  const selectedDateRef = useRef<DateTime | undefined>(undefined)
  const isArchiveRoute = useIsArchiveRoute()
  const scheduleQuery = useScheduleQuery({ fetchArchived: isArchiveRoute })
  const scheduleItems = scheduleQuery.data?.items || []
  const deleteAllLessons = useDeleteAllLessonsMutation()
  const deleteAllStudents = useDeleteStudentsMutation()
  const applyMockData = useApplyMockDataMutation()

  if (scheduleQuery.isPending) return <div>Загрузка...</div>
  if (scheduleQuery.isError) return <div>Ошибка {scheduleQuery.error.message}</div>

  const dict: { [studentId: string]: { [dateOnly: string]: Lesson[] } } = {}

  scheduleItems.forEach(({ student, lessons }) => {
    dict[student.id] = classesToDictionary(lessons)
  })

  const firstDay = dayjs((scheduleQuery.data.pageParams[0] as Period).start)
  const lastDay = dayjs((scheduleQuery.data.pageParams.at(-1) as Period).end)
  const days = Array.from({ length: lastDay.diff(firstDay, "day") + 1 }, (_, i) => firstDay.add(i, "day"))

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {!scheduleItems?.length && <ContentPlaceholder />}
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={() => setSelectedStudentId("create")}>
          Добавить ученика
        </Button>
        <Button onClick={() => deleteAllLessons.mutate()}>Удалить все занятия {deleteAllLessons.status}</Button>
        <Button onClick={() => deleteAllStudents.mutate()}>Удалить всех учеников {deleteAllStudents.status}</Button>
        <Button onClick={() => applyMockData.mutate()}>Применить тестовые данные</Button>
      </Space>

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
      <S.Table $studentsCount={scheduleItems.length ?? 0} style={{ position: "sticky" }}>
        <TableHeader items={scheduleItems ?? []} onEdit={(s) => setSelectedStudentId(s.id)} />
      </S.Table>
      <S.Table
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
                <S.DateCell $isToday={isToday(today)}>{toDateOnly(today)}</S.DateCell>

                {scheduleItems.map(({ student }) => {
                  const lessons2 = dict[student.id]?.[toDateOnly(today)] ?? []

                  return (
                    <React.Fragment key={student.name}>
                      <S.Cell>
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

                          <S.AddLessonButton
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
                          </S.AddLessonButton>
                        </Flex>
                      </S.Cell>
                    </React.Fragment>
                  )
                })}
              </React.Fragment>
            )
          })}
      </S.Table>
    </div>
  )
}
