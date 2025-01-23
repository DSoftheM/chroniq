import { Modal, TimePicker, InputNumber, Checkbox, Input, Form, Button, notification } from "antd"
import { createStudent, Student } from "./types/student"
import { Nullish } from "./types/lib"
import { useUpdateStudentMutation } from "./api/use-update-student-mutation"
import { useCreateStudentMutation } from "./api/use-create-student-mutation"
import { useImmer } from "use-immer"

const { TextArea } = Input

type Props = {
  student: Student | Nullish
  isModalOpen: boolean
  onClose: () => void
}

export function CreateOrUpdateStudentModal(props: Props) {
  const [student, updateStudent] = useImmer<Student>(props.student ?? createStudent())

  const isEdit = Boolean(props.student)
  const updateStudentMutation = useUpdateStudentMutation()
  const createStudentMutation = useCreateStudentMutation()

  const [api, contextHolder] = notification.useNotification()

  const openNotification = () => {
    api.info({
      message: `Успешно`,
      type: "success",
      description: isEdit ? "Ученик обновлен" : "Ученик создан",
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
            await updateStudentMutation.mutateAsync(student)
          } else {
            await createStudentMutation.mutateAsync(student)
          }
          openNotification()
          props.onClose()
        }}
        onCancel={() => props.onClose()}
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
