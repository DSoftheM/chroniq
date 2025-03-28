import {
  Modal,
  InputNumber,
  Input,
  Form,
  notification,
  Flex,
  Avatar,
  Checkbox,
  Upload,
  UploadFile,
  message,
} from "antd"
import { createStudent, isStudentValid, Student } from "../types/student"
import { useUpdateStudentMutation } from "../api/use-update-student-mutation"
import { useCreateStudentMutation } from "../api/use-create-student-mutation"
import { useImmer } from "use-immer"
import { useScheduleQuery } from "../api/use-schedule-query"
import { Nullish } from "../types/lib"
import { PlusOutlined, SyncOutlined } from "@ant-design/icons"
import { useIsArchiveRoute } from "../../schedule/lib/use-is-archive-route"
import { useState } from "react"
import { api } from "@/shared/api/provider"

const { TextArea } = Input

type Props = {
  close: () => void
  initialStudent: Student | Nullish
}

export function CreateOrUpdateStudentModal(props: Props) {
  const isArchiveRoute = useIsArchiveRoute()
  const scheduleQuery = useScheduleQuery({ refetchOnMount: false, fetchArchived: isArchiveRoute })

  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [student, updateStudent] = useImmer<Student>(props.initialStudent ?? createStudent())

  const isEdit = Boolean(props.initialStudent)
  const updateStudentMutation = useUpdateStudentMutation()
  const createStudentMutation = useCreateStudentMutation()

  const [{ info }, contextHolder] = notification.useNotification()

  const openNotification = () => {
    info({
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
        okButtonProps={{ disabled: !isStudentValid(student) }}
        title={isEdit ? `Редактировать ученика ${student.name}` : "Добавить"}
        open
        onOk={async () => {
          const updated = {
            ...student,
            avatarUrl: fileList[0] ? api.getFileUrl(fileList[0].response.fileName) : student.avatarUrl,
          }
          if (isEdit) await updateStudentMutation.mutateAsync(updated)
          else await createStudentMutation.mutateAsync(updated)

          openNotification()
          props.close()
        }}
        onCancel={() => props.close()}
      >
        <Form layout="vertical">
          <Form.Item label="Имя" required>
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
              title: "Случайный аватар",
              icon: (
                <div>
                  <SyncOutlined
                    onClick={() => {
                      updateStudent((draft) => {
                        const seed = student.id + "-" + Date.now()
                        draft.avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`
                      })
                      setFileList([])
                    }}
                  />
                </div>
              ),
            }}
          >
            <Flex gap={10} align="center">
              <div style={{ flex: 1 }}>
                <Input
                  value={student.avatarUrl.startsWith("/api/files/download/") ? "" : student.avatarUrl}
                  placeholder="Ссылка на фото"
                  onChange={(e) => {
                    updateStudent((draft) => {
                      draft.avatarUrl = e.target.value
                    })
                    setFileList([])
                  }}
                />
              </div>
              <Upload
                accept="image/*"
                action="api/files/upload"
                listType="picture-circle"
                maxCount={1}
                fileList={fileList}
                onChange={async (x) => {
                  updateStudent((draft) => {
                    draft.avatarUrl = ""
                  })
                  setFileList(x.fileList)
                  if (x.file.error && x.fileList.length) {
                    message.error(x.file.response)
                  }
                }}
              >
                {(() => {
                  if (fileList[0]) return null
                  if (student.avatarUrl) return <Avatar src={student.avatarUrl} size={100} />
                  return (
                    <Flex gap={4}>
                      <PlusOutlined />
                      <div>Upload</div>
                    </Flex>
                  )
                })()}
              </Upload>
            </Flex>
          </Form.Item>

          <Form.Item label="Описание">
            <TextArea
              autoSize
              value={student.description}
              onChange={(e) =>
                updateStudent((draft) => {
                  draft.description = e.target.value
                })
              }
            />
          </Form.Item>

          <Form.Item label="Архивировать">
            <Checkbox
              checked={student.isArchived}
              onChange={(e) =>
                updateStudent((draft) => {
                  draft.isArchived = e.target.checked
                })
              }
            >
              Да/Нет
            </Checkbox>
          </Form.Item>

          {updateStudentMutation.isError && <p>{updateStudentMutation.error.message}</p>}
          {createStudentMutation.isError && <p>{createStudentMutation.error.message}</p>}
        </Form>
      </Modal>
    </>
  )
}
