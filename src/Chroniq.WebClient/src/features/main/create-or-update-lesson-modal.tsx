import { Modal, TimePicker, InputNumber, Checkbox, Input, Form, Button, Typography, Space } from "antd"
import { useEffect, useState } from "react"
import { createLesson, Lesson } from "./types/lesson"
import { useImmer } from "use-immer"
import { useScheduleQuery } from "./api/use-schedule-query"
import dayjs from "dayjs"
import { toDateOnly } from "./lib"
import { DateTime, TimeSpan } from "./types/lib"
import { useCreateLessonMutation, useDeleteLessonMutation, useUpdateLessonMutation } from "./api/lesson-api"
import { useNotification } from "../../global/notification-provider"
import { Student } from "./types/student"

const { TextArea } = Input

type Props = {
  initialLesson: Lesson | null
  student: Student
  creationDate: DateTime | undefined
  close: () => void
}

export function CreateOrUpdateLessonModal(props: Props) {
  const scheduleQuery = useScheduleQuery({ refetchOnMount: false })
  const isEdit = Boolean(props.initialLesson)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [lesson, updateLesson] = useImmer<Lesson>(
    props.initialLesson ?? createLesson({ student: props.student, date: props.creationDate })
  )

  const updateLessonMutation = useUpdateLessonMutation({
    onSuccess: () => {
      api.success({ message: `Успешно`, description: "Занятие обновлено", placement: "topRight" })
      props.close()
    },
  })
  const createLessonMutation = useCreateLessonMutation({
    onSuccess: () => {
      api.success({ message: `Успешно`, description: "Занятие создано", placement: "topRight" })
      props.close()
    },
  })
  const deleteLessonMutation = useDeleteLessonMutation({
    onSuccess: () => {
      api.success({ message: `Успешно`, description: "Занятие удалено", placement: "topRight" })
      props.close()
    },
  })

  const api = useNotification()

  if (scheduleQuery.isPending) return <div>Загрузка...</div>
  if (scheduleQuery.isError) return <div>Ошибка {scheduleQuery.error.message}</div>

  return (
    <>
      <Modal
        footer={
          !showDeleteConfirm ? (
            [
              isEdit && (
                <Button key="delete" danger onClick={() => setShowDeleteConfirm(true)}>
                  Удалить
                </Button>
              ),
              <Button key="cancel" onClick={() => props.close()}>
                Отменить
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={async () => {
                  if (isEdit) {
                    await updateLessonMutation.mutateAsync(lesson)
                  } else {
                    await createLessonMutation.mutateAsync(lesson)
                  }
                  props.close()
                }}
              >
                Сохранить
              </Button>,
            ]
          ) : (
            <Space direction="vertical">
              <Typography.Text>Вы действительно хотите удалить занятие?</Typography.Text>
              <Space>
                <Button danger type="primary" onClick={() => deleteLessonMutation.mutateAsync(lesson.id)}>
                  Удалить
                </Button>
                <Button onClick={() => setShowDeleteConfirm(false)}>Отменить</Button>
              </Space>
            </Space>
          )
        }
        title={isEdit ? "Редактировать" : `Создать занятие для ${props.student.name} на ${toDateOnly(lesson.date)}`}
        open
        onCancel={() => props.close()}
      >
        <Form layout="vertical">
          <Form.Item label="Во сколько">
            <TimePicker
              value={dayjs(lesson.date)}
              format={"HH:mm"}
              minuteStep={15}
              onChange={(val) => {
                updateLesson((draft) => {
                  if (!draft || !val) return
                  const [h, m] = [val.hour(), val.minute()]
                  draft.date = (dayjs(draft.date).set("hour", h).set("minute", m).unix() * 1000) as DateTime
                })
              }}
            />
          </Form.Item>

          <Form.Item label="Длительность">
            <TimePicker
              format={"HH:mm"}
              value={dayjs(lesson.duration, "HH:mm")}
              minuteStep={15}
              onChange={(val) => {
                updateLesson((draft) => {
                  if (!draft) return
                  draft.duration = val ? getDuration(val.toDate()) : "0:0"
                })
              }}
            />
          </Form.Item>

          <Form.Item label="Стоимость">
            <InputNumber
              min={1}
              max={10000}
              value={props.student.defaultPrice}
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

          {updateLessonMutation.isError && <p>{updateLessonMutation.error.message}</p>}
          {createLessonMutation.isError && <p>{createLessonMutation.error.message}</p>}
        </Form>
      </Modal>
    </>
  )
}

function getDuration(date: Date): TimeSpan {
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }) as TimeSpan
}
