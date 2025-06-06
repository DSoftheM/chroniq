import { ChangeOrderItemDTO } from "@/shared/api/types/change-order-dto"
import { useChangeStudentOrderMutation } from "@/features/main/api/use-change-student-order-mutation"
import { StudentCellView } from "@/features/main/ui/student-cell-view"
import { S } from "@/features/main/ui/styled"
import { ScheduleItem } from "@/features/main/types/schedule"
import { Student } from "@/features/main/types/student"
import styled from "styled-components"
import { ZIndex } from "@/shared/lib/styled.lib"

const Root = styled.div<{ $studentsCount: number }>`
  display: grid;
  grid-template-columns: 150px repeat(${(props) => props.$studentsCount}, minmax(400px, 1fr));
  grid-column: 1 / -1;
  position: sticky;
  left: 0;
  top: 0;
  z-index: ${ZIndex.TableHeader};
  background-color: #fff;
  padding: 0;
`

export function TableHeader({ items, onEdit }: { items: ScheduleItem[]; onEdit: (s: Student) => void }) {
  const changeOrderMutation = useChangeStudentOrderMutation()

  return (
    <Root $studentsCount={items.length}>
      <S.EmptyCell style={{ border: "none" }} />

      {items.map(({ student, order }, i) => {
        return (
          <div style={{ overflow: "hidden", padding: 0, border: "none" }} key={student.id}>
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
    </Root>
  )
}

function swapOrder(a: ChangeOrderItemDTO, b: ChangeOrderItemDTO) {
  const temp = a.order
  a.order = b.order
  b.order = temp

  return [a, b]
}
