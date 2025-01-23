import { Modal, TimePicker, InputNumber, Checkbox, Input, Button, notification, Form } from "antd"
import { Student } from "./types/student"
import { Nullish } from "./types/lib"
import { useUpdateStudentMutation } from "./api/use-update-student-mutation"
import { useCreateStudentMutation } from "./api/use-create-student-mutation"
import { useState } from "react"
import { uuid } from "./lib"
import { createLesson, Lesson } from "./types/lesson"
import { api } from "../../api/provider"
import { useMutation } from "@tanstack/react-query"
import { useImmer } from "use-immer"

const { TextArea } = Input

type Props = {
  lesson: Lesson | Nullish
  isModalOpen: boolean
  onClose: () => void
}

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

export function CreateOrUpdateLessonModal(props: Props) {
  const [lesson, updateLesson] = useImmer<Lesson>(props.lesson ?? createLesson())

  const isEdit = Boolean(props.lesson)
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

  return (
    <>
      {contextHolder}
      <Modal
        title={isEdit ? "Редактировать" : "Добавить"}
        open={props.isModalOpen}
        onOk={async () => {
          if (isEdit) {
            await updateLessonMutation.mutateAsync(lesson)
          } else {
            await createLessonMutation.mutateAsync(lesson)
          }
          openNotification()
          props.onClose()
        }}
        onCancel={() => props.onClose()}
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
