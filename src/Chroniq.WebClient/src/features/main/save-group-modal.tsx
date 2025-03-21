import { Modal, Input, Form, Button, Typography, Space } from "antd"
import { useState } from "react"
import { useImmer } from "use-immer"
import { useScheduleQuery } from "./api/use-schedule-query"
import { toDateOnly, uuid } from "./lib"
import { useCreateLessonMutation, useDeleteLessonMutation, useUpdateLessonMutation } from "./api/lesson-api"
import { useNotification } from "../../global/notification-provider"
import { useIsArchiveRoute } from "../schedule/use-is-archive-route"

const { TextArea } = Input

type Props = {
  initialGroup: Group | null
  group: Group
  close: () => void
}

function createGroup(): Group {
  return {
    id: uuid(),
    name: "",
    description: "",
  }
}

type Group = {
  id: string
  name: string
  description: string
}

// Название группы
// Описание

export function SaveGroupModal(props: Props) {
  // const isArchiveRoute = useIsArchiveRoute()
  // const scheduleQuery = useScheduleQuery({ refetchOnMount: false, fetchArchived: isArchiveRoute })
  // const isEdit = Boolean(props.initialGroup)
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  // const [group, updateGroup] = useImmer<Group>(props.initialGroup ?? createGroup())
  // const updateLessonMutation = useUpdateLessonMutation({
  //   onSuccess: () => {
  //     api.success({ message: `Успешно`, description: "Занятие обновлено", placement: "topRight" })
  //     props.close()
  //   },
  // })
  // const createLessonMutation = useCreateLessonMutation({
  //   onSuccess: () => {
  //     api.success({ message: `Успешно`, description: "Занятие создано", placement: "topRight" })
  //     props.close()
  //   },
  // })
  // const deleteLessonMutation = useDeleteLessonMutation({
  //   onSuccess: () => {
  //     api.success({ message: `Успешно`, description: "Занятие удалено", placement: "topRight" })
  //     props.close()
  //   },
  // })
  // const api = useNotification()
  // if (scheduleQuery.isPending) return <div>Загрузка...</div>
  // if (scheduleQuery.isError) return <div>Ошибка {scheduleQuery.error.message}</div>
  // return (
  //   <>
  //     <Modal
  //       footer={
  //         !showDeleteConfirm ? (
  //           [
  //             isEdit && (
  //               <Button key="delete" danger onClick={() => setShowDeleteConfirm(true)}>
  //                 Удалить
  //               </Button>
  //             ),
  //             <Button key="cancel" onClick={() => props.close()}>
  //               Отменить
  //             </Button>,
  //             <Button
  //               key="submit"
  //               type="primary"
  //               onClick={async () => {
  //                 // if (isEdit) {
  //                 //   await updateLessonMutation.mutateAsync(lesson)
  //                 // } else {
  //                 //   await createLessonMutation.mutateAsync(lesson)
  //                 // }
  //                 props.close()
  //               }}
  //             >
  //               Сохранить
  //             </Button>,
  //           ]
  //         ) : (
  //           <Space direction="vertical">
  //             <Typography.Text>Вы действительно хотите удалить группу? Ученики не удалятся</Typography.Text>
  //             <Space>
  //               <Button danger type="primary" onClick={() => deleteLessonMutation.mutateAsync(lesson.id)}>
  //                 Удалить
  //               </Button>
  //               <Button onClick={() => setShowDeleteConfirm(false)}>Отменить</Button>
  //             </Space>
  //           </Space>
  //         )
  //       }
  //       title={isEdit ? "Редактировать" : `Создать занятие для ${props.group.name} на ${toDateOnly(lesson.date)}`}
  //       open
  //       onCancel={() => props.close()}
  //     >
  //       <Form layout="vertical">
  //         <Form.Item label="Название">
  //           <Input value={group.name} onChange={(e) => updateGroup((draft) => (draft.name = e.target.value))} />
  //         </Form.Item>
  //         <Form.Item label="Описание">
  //           <TextArea
  //             value={group.description}
  //             onChange={(e) =>
  //               updateGroup((draft) => {
  //                 if (!draft) return
  //                 draft.description = e.target.value
  //               })
  //             }
  //           />
  //         </Form.Item>
  //         {updateLessonMutation.isError && <p>{updateLessonMutation.error.message}</p>}
  //         {createLessonMutation.isError && <p>{createLessonMutation.error.message}</p>}
  //       </Form>
  //     </Modal>
  //   </>
  // )
}
