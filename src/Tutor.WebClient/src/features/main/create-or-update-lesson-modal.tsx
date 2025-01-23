import { Modal, TimePicker, InputNumber, Checkbox, Input, Button, notification, Form } from "antd"
import { useEffect } from "react"
import { createLesson, Lesson } from "./types/lesson"
import { api } from "../../api/provider"
import { useMutation } from "@tanstack/react-query"
import { useImmer } from "use-immer"
import { useScheduleQuery } from "./api/use-schedule-query"
import { useNavigate, useParams } from "react-router-dom"
import { nav } from "../../lib/nav"

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

export function CreateOrUpdateLessonModal() {
  const scheduleQuery = useScheduleQuery({ refetchOnMount: false })
  const { lessonId, studentId } = useParams<{ studentId: string; lessonId: string }>()
  const student = scheduleQuery.data?.items.find(({ student }) => student.id === studentId)?.student
  const initialLesson = student?.lessons.find(({ id }) => id === lessonId)
  const navigate = useNavigate()

  const [lesson, updateLesson] = useImmer<Lesson>(initialLesson ?? createLesson())
  useEffect(() => initialLesson && updateLesson(initialLesson), [initialLesson])

  const isEdit = Boolean(initialLesson)
  const updateLessonMutation = useUpdateLessonMutation()
  const createLessonMutation = useCreateLessonMutation()

  const [api, contextHolder] = notification.useNotification()
  const close = () => navigate(nav.main)

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

  return (
    <>
      {contextHolder}
      <Modal
        title={isEdit ? "Редактировать" : "Добавить"}
        open
        onOk={async () => {
          if (isEdit) {
            await updateLessonMutation.mutateAsync(lesson)
          } else {
            await createLessonMutation.mutateAsync(lesson)
          }
          openNotification()
          close()
        }}
        onCancel={() => close()}
      >
        <Form.Item label="Во сколько">
          <TimePicker format={"HH:mm"} minuteStep={15} onChange={console.log} />
        </Form.Item>

        <Form.Item label="Длительность">
          <TimePicker format={"HH:mm"} minuteStep={15} onChange={console.log} />
        </Form.Item>

        <Form.Item label="Стоимость">
          <InputNumber min={1} max={10} defaultValue={3} onChange={console.log} />
        </Form.Item>

        <Form.Item label="Описание">
          <TextArea
            value={lesson.description}
            onChange={(e) =>
              updateLesson((draft) => {
                draft.description = e.target.value
              })
            }
          />
        </Form.Item>

        <Form.Item label="Занятие оплачено">
          <Checkbox value={lesson.paid} onChange={(e) => updateLesson((draft) => (draft.paid = e.target.checked))}>
            Да/Нет
          </Checkbox>
        </Form.Item>

        <Button>{isEdit ? "Сохранить" : "Создать"}</Button>

        {updateLessonMutation.isError && <p>{updateLessonMutation.error.message}</p>}
        {createLessonMutation.isError && <p>{createLessonMutation.error.message}</p>}
      </Modal>
    </>
  )
}
