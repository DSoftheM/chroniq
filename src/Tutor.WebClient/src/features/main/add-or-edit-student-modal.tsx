import { Modal, TimePicker, InputNumber, Checkbox, Input, Form, Button, notification } from "antd"
import { createStudent, Student } from "./types/student"
import { Nullish } from "./types/lib"
import { useUpdateStudentMutation } from "./api/use-update-student-mutation"
import { useCreateStudentMutation } from "./api/use-create-student-mutation"
import { useImmer } from "use-immer"
import { useEffect } from "react"
import { useScheduleQuery } from "./api/use-schedule-query"
import { useNavigate, useParams } from "react-router-dom"
import { nav } from "../../lib/nav"

const { TextArea } = Input

export function CreateOrUpdateStudentModal() {
  const scheduleQuery = useScheduleQuery({ refetchOnMount: false })
  const { studentId } = useParams<{ studentId: string }>()
  const initialStudent = scheduleQuery.data?.items.find(({ student }) => student.id === studentId)?.student

  const [student, updateStudent] = useImmer<Student>(initialStudent ?? createStudent())
  useEffect(() => initialStudent && updateStudent(initialStudent), [initialStudent])

  const isEdit = Boolean(initialStudent)
  const updateStudentMutation = useUpdateStudentMutation()
  const createStudentMutation = useCreateStudentMutation()

  const [api, contextHolder] = notification.useNotification()
  const navigate = useNavigate()
  const close = () => navigate(nav.main)

  const openNotification = () => {
    api.info({
      message: `Успешно`,
      type: "success",
      description: isEdit ? "Ученик обновлен" : "Ученик создан",
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
            await updateStudentMutation.mutateAsync(student)
          } else {
            await createStudentMutation.mutateAsync(student)
          }
          openNotification()
          close()
        }}
        onCancel={() => close()}
      >
        <Form.Item label="Имя">
          <Input value={student.name} onChange={(e) => updateStudent((draft) => (draft.name = e.target.value))} />
        </Form.Item>

        <Form.Item label="Обычная цена">
          <InputNumber
            value={student.defaultPrice}
            onChange={(value) =>
              updateStudent((draft) => {
                draft.defaultPrice = value ?? 0
              })
            }
          />
        </Form.Item>

        <Form.Item label="Ссылка на фото">
          <Input
            value={student.avatarUrl}
            onChange={(e) =>
              updateStudent((draft) => {
                draft.avatarUrl = e.target.value
              })
            }
          />
        </Form.Item>

        <Form.Item label="Описание">
          <TextArea
            value={student.description}
            onChange={(e) =>
              updateStudent((draft) => {
                draft.description = e.target.value
              })
            }
          />
        </Form.Item>

        <Button>{isEdit ? "Сохранить" : "Создать"}</Button>

        {updateStudentMutation.isError && <p>{updateStudentMutation.error.message}</p>}
        {createStudentMutation.isError && <p>{createStudentMutation.error.message}</p>}
      </Modal>
    </>
  )
}
