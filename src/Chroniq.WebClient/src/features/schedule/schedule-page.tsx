import { useRef, useState } from "react"
import { classesToDictionary } from "../main/lib"
import { useScheduleQuery } from "../main/api/use-schedule-query"
import { ContentPlaceholder } from "../main/content-placeholder"
import { CreateOrUpdateLessonModal } from "../main/create-or-update-lesson-modal"
import { DateTime } from "../main/types/lib"
import { CreateOrUpdateStudentModal } from "../main/create-or-update-student-modal"
import { Button, Space } from "antd"
import { Lesson } from "../main/types/lesson"
import { useIsArchiveRoute } from "./use-is-archive-route"
import { ScheduleTable } from "./schedule-table"
import { SaveGroupModal } from "../main/save-group-modal"

type SelectedLesson = {
  studentId: string
  lessonId: string | null
}

export function SchedulePage() {
  const [selectedLesson, setSelectedLesson] = useState<SelectedLesson | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null | "create">(null)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null | "create">(null)
  const selectedDateRef = useRef<DateTime | undefined>(undefined)
  const isArchiveRoute = useIsArchiveRoute()
  const scheduleQuery = useScheduleQuery({ fetchArchived: isArchiveRoute })
  const scheduleItems = scheduleQuery.data?.items || []

  if (scheduleQuery.isPending) return <div>Загрузка...</div>
  if (scheduleQuery.isError) return <div>Ошибка {scheduleQuery.error.message}</div>

  const dict: { [studentId: string]: { [dateOnly: string]: Lesson[] } } = {}

  scheduleItems.forEach(({ student, lessons }) => {
    dict[student.id] = classesToDictionary(lessons)
  })

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {!scheduleItems?.length && <ContentPlaceholder />}
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={() => setSelectedStudentId("create")}>
          Добавить ученика
        </Button>
        <Button type="primary" onClick={() => setSelectedGroupId("create")}>
          Добавить группу
        </Button>
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

      {/* {selectedGroupId && (
        <SaveGroupModal
          creationDate={selectedDateRef.current}
          close={() => setSelectedGroupId(null)}
          group={scheduleItems.find(({ student }) => student.id === selectedLesson.studentId)!.student}
          initialLesson={
            selectedStudentId === "create"
              ? null
              : scheduleItems
                  .find(({ student }) => student.id === selectedLesson.studentId)
                  ?.lessons.find(({ id }) => id === selectedLesson.lessonId) ?? null
          }
        />
      )} */}

      {selectedStudentId && (
        <CreateOrUpdateStudentModal
          close={() => setSelectedStudentId(null)}
          initialStudent={scheduleItems.find(({ student }) => student.id === selectedStudentId)?.student}
        />
      )}

      <ScheduleTable
        scheduleQuery={scheduleQuery}
        onLessonCreate={(data, date) => {
          setSelectedLesson(data)
          selectedDateRef.current = date
        }}
        onLessonEdit={setSelectedLesson}
        items={scheduleItems}
        onStudentEdit={(id) => setSelectedStudentId(id)}
        isArchiveRoute={isArchiveRoute}
      />
    </div>
  )
}
