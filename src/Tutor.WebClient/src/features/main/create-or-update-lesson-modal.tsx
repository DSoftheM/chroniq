import { Modal, TimePicker, InputNumber, Checkbox, Input, Button, notification, Form } from "antd"
import { useEffect } from "react"
import { createLesson, Lesson } from "./types/lesson"
import { api } from "../../api/provider"
import { useMutation } from "@tanstack/react-query"
import { useImmer } from "use-immer"
import { useScheduleQuery } from "./api/use-schedule-query"
import dayjs from "dayjs"
import { toDateOnly } from "./lib"
import { DateTime } from "./types/lib"

const { TextArea } = Input

function useUpdateLessonMutation() {
  return useMutation({
    mutationFn: api.updateLesson,
  })
}

function useCreateLessonMutation() {
  return useMutation({
    mutationFn: api.createLesson,
  })
}

type Props = {
  lessonId: string | null
  studentId: string
  creationDate: DateTime | undefined
  close: () => void
}

export function CreateOrUpdateLessonModal(props: Props) {
  const scheduleQuery = useScheduleQuery({ refetchOnMount: false })
  const scheduleItem = scheduleQuery.data?.items.find(({ student }) => student.id === props.studentId)
  const student = scheduleItem?.student

  const initialLesson = props.lessonId
    ? scheduleItem?.lessons.find(({ id }) => id === props.lessonId)
    : student
    ? createLesson({ student, date: props.creationDate })
    : null

  const [lesson, updateLesson] = useImmer<Lesson | null>(initialLesson ?? null)

  useEffect(() => {
    if (initialLesson && !lesson) updateLesson(initialLesson)
  }, [initialLesson])

  const isEdit = Boolean(props.lessonId)
  const updateLessonMutation = useUpdateLessonMutation()
  const createLessonMutation = useCreateLessonMutation()

  const [api, contextHolder] = notification.useNotification()

  const openNotification = () => {
    api.info({
      message: `Успешно`,
      type: "success",
      description: isEdit ? "Занятие обновлено" : "Занятие создано",
      placement: "topRight",
    })
  }

  if (scheduleQuery.isPending) return <div>Загрузка...</div>
  if (scheduleQuery.isError) return <div>Ошибка {scheduleQuery.error.message}</div>
  if (!student || !lesson) return <div>Ученик не найден</div>

  return (
    <>
      {contextHolder}
      <Modal
        title={isEdit ? "Редактировать" : `Создать занятие для ${student.name} на ${toDateOnly(lesson.date)}`}
        open
        onOk={async () => {
          if (isEdit) {
            await updateLessonMutation.mutateAsync(lesson)
          } else {
            await createLessonMutation.mutateAsync(lesson)
          }
          openNotification()
          props.close()
        }}
        onCancel={() => props.close()}
      >
        <Form layout="vertical">
          <Form.Item label="Во сколько">
            <TimePicker value={dayjs(lesson.date)} format={"HH:mm"} minuteStep={15} onChange={console.log} />
          </Form.Item>

          <Form.Item label="Длительность">
            <TimePicker
              format={"HH:mm"}
              value={dayjs(lesson.duration, "HH:mm")}
              minuteStep={15}
              onChange={(val) => {
                updateLesson((draft) => {
                  if (!draft) return
                  draft.duration = val ? getDuration(val.toDate()) : ""
                })
              }}
            />
          </Form.Item>

          <Form.Item label="Стоимость">
            <InputNumber
              min={1}
              max={10000}
              value={student.defaultPrice}
              onChange={(val) => {
                updateLesson((draft) => {
                  if (!draft) return
                  draft.price = val ?? 1
                })
              }}
            />
          </Form.Item>

          <Form.Item label="Описание">
            <TextArea
              value={lesson.description}
              onChange={(e) =>
                updateLesson((draft) => {
                  if (!draft) return
                  draft.description = e.target.value
                })
              }
            />
          </Form.Item>

          <Form.Item label="Занятие оплачено">
            <Checkbox
              checked={lesson.paid}
              onChange={(e) =>
                updateLesson((draft) => {
                  if (!draft) return
                  draft.paid = e.target.checked
                })
              }
            >
              Да/Нет
            </Checkbox>
          </Form.Item>

          <Button>{isEdit ? "Сохранить" : "Создать"}</Button>

          {updateLessonMutation.isError && <p>{updateLessonMutation.error.message}</p>}
          {createLessonMutation.isError && <p>{createLessonMutation.error.message}</p>}
        </Form>
      </Modal>
    </>
  )
}

function getDuration(date: Date) {
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  })
}
