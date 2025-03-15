import { ChangeOrderItemDTO } from "@/api/types/change-order-dto"
import { useChangeStudentOrderMutation } from "../main/api/use-change-student-order-mutation"
import { StudentCellView } from "../main/student-cell-view"
import { S } from "../main/styled"
import { ScheduleItem } from "../main/types/schedule"
import { Student } from "../main/types/student"

export function TableHeader({
  items,
  onEdit,
  hide,
}: {
  items: ScheduleItem[]
  onEdit: (s: Student) => void
  hide?: boolean
}) {
  const changeOrderMutation = useChangeStudentOrderMutation()

  return (
    <>
      <S.EmptyCell style={{ height: hide ? "0" : "auto", border: "none" }} />

      {items.map(({ student, order }, i) => {
        return (
          <div style={{ height: hide ? "0" : "auto", overflow: "hidden", padding: 0, border: "none" }} key={student.id}>
            {order}
            <br />
            {student.id}
            <StudentCellView
              isFirst={i === 0}
              isLast={i === items.length - 1}
              key={student.name}
              student={student}
              onEdit={() => onEdit(student)}
              onMove={(direction) => {
                if (direction === "left") {
                  const prevScheduleItem = items[i - 1]

                  const prev: ChangeOrderItemDTO = {
                    order: prevScheduleItem.order,
                    studentId: prevScheduleItem.student.id,
                  }
                  const current: ChangeOrderItemDTO = { order, studentId: student.id }

                  changeOrderMutation.mutate({ items: swapOrder(prev, current) })
                }

                if (direction === "right") {
                  const nextScheduleItem = items[i + 1]

                  const next: ChangeOrderItemDTO = {
                    order: nextScheduleItem.order,
                    studentId: nextScheduleItem.student.id,
                  }
                  const current: ChangeOrderItemDTO = { order, studentId: student.id }

                  changeOrderMutation.mutate({ items: swapOrder(next, current) })
                }
              }}
            />
          </div>
        )
      })}
    </>
  )
}

function swapOrder(a: ChangeOrderItemDTO, b: ChangeOrderItemDTO) {
  const temp = a.order
  a.order = b.order
  b.order = temp

  return [a, b]
}
