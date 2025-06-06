import React from "react"
import { LessonView } from "@/features/main/ui/lesson-view"
import { PlusOutlined } from "@ant-design/icons"
import { Flex } from "antd"
import { S } from "@/features/main/ui/styled"
import { ScheduleItem } from "@/features/main/types/schedule"
import { useWorkCalendar } from "@/features/main/api/use-work-calendar-query"
import { useScheduleQuery } from "@/features/main/api/use-schedule-query"
import { DateTime } from "@/features/main/types/lib"
import { getDaysForView, processScheduleItems } from "../lib"
import { Scroll } from "@/shared/ui/scroll"
import { TableHeader } from "./table-header"
import { DateCell } from "./date-cell"

type Props = {
  items: ScheduleItem[]
  isArchiveRoute: boolean
  onStudentEdit: (id: string) => void
  onLessonEdit: (data: { studentId: string; lessonId: string | null }) => void
  onLessonCreate: (data: { studentId: string; lessonId: string | null }, date: DateTime) => void
  scheduleQuery: ReturnType<typeof useScheduleQuery>
}

export function ScheduleTable(props: Props) {
  const scheduleItems = props.items
  const { isHoliday } = useWorkCalendar()

  if (!props.scheduleQuery.data) return

  const days = getDaysForView(props.scheduleQuery.data.pageParams)
  const { getLessons } = processScheduleItems(scheduleItems)

  return (
    <Scroll
      style={{ maxHeight: "100%", overflow: "auto" }}
      onReachEnd={() => props.scheduleQuery.hasNextPage && props.scheduleQuery.fetchNextPage()}
      onReachStart={() => props.scheduleQuery.hasPreviousPage && props.scheduleQuery.fetchPreviousPage()}
    >
      <S.Table $studentsCount={scheduleItems.length ?? 0}>
        <TableHeader items={scheduleItems ?? []} onEdit={(s) => props.onStudentEdit(s.id)} />

        {days
          .map((x) => x.toDate().getTime())
          .map((today) => {
            return (
              <React.Fragment key={today}>
                <DateCell date={today} isHoliday={isHoliday(today)} />

                {scheduleItems.map(({ student }) => {
                  const lessons2 = getLessons(student, today)

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
                                  onEdit={() => props.onLessonEdit({ studentId: student.id, lessonId: x.id })}
                                />
                              )
                            })}

                          <S.AddLessonButton
                            style={{ width: "100%" }}
                            variant="link"
                            color="green"
                            onClick={() => props.onLessonCreate({ studentId: student.id, lessonId: null }, today)}
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
    </Scroll>
  )
}
