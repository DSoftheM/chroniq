import { Modal, InputNumber, Input, Form, notification, Flex, Avatar, Popover } from "antd"
import { createStudent, Student } from "./types/student"
import { useUpdateStudentMutation } from "./api/use-update-student-mutation"
import { useCreateStudentMutation } from "./api/use-create-student-mutation"
import { useImmer } from "use-immer"
import { useScheduleQuery } from "./api/use-schedule-query"
import { Nullish } from "./types/lib"
import { SyncOutlined } from "@ant-design/icons"

const { TextArea } = Input

type Props = {
  close: () => void
  initialStudent: Student | Nullish
}

export function CreateOrUpdateStudentModal(props: Props) {
  const scheduleQuery = useScheduleQuery({ refetchOnMount: false })

  const [student, updateStudent] = useImmer<Student>(props.initialStudent ?? createStudent())

  const isEdit = Boolean(props.initialStudent)
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

  if (scheduleQuery.isPending) return <div>Загрузка...</div>
  if (scheduleQuery.isError) return <div>Ошибка {scheduleQuery.error.message}</div>

  return (
    <>
      {contextHolder}
      <Modal
        cancelText="Отменить"
        okText="Сохранить"
        title={isEdit ? `Редактировать ученика ${student.name}` : "Добавить"}
        open
        onOk={async () => {
          if (isEdit) {
            await updateStudentMutation.mutateAsync(student)
          } else {
            await createStudentMutation.mutateAsync(student)
          }
          openNotification()
          props.close()
        }}
        onCancel={() => props.close()}
      >
        <Form layout="vertical">
          <Form.Item label="Имя">
            <Input
              value={student.name}
              onChange={(e) =>
                updateStudent((draft) => {
                  draft.name = e.target.value
                })
              }
            />
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

          <Form.Item
            label="Ссылка на фото"
            tooltip={{
              title: "Использовать случайную фотографию 500x500",
              icon: (
                <div>
                  <SyncOutlined
                    onClick={() => {
                      updateStudent((draft) => {
                        draft.avatarUrl = `https://lipsum.app/random/500x500?random=${Math.random()}`
                      })
                    }}
                  />
                </div>
              ),
            }}
          >
            <Flex gap={10}>
              <Input
                value={student.avatarUrl}
                onChange={(e) =>
                  updateStudent((draft) => {
                    draft.avatarUrl = e.target.value
                  })
                }
              />
              <Popover placement="top" content={<img src={student.avatarUrl} />}>
                <Avatar src={student.avatarUrl} />
              </Popover>
            </Flex>
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

          {updateStudentMutation.isError && <p>{updateStudentMutation.error.message}</p>}
          {createStudentMutation.isError && <p>{createStudentMutation.error.message}</p>}
        </Form>
      </Modal>
    </>
  )
}
