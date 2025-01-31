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
  return (
    <>
      <S.EmptyCell style={{ height: hide ? "0" : "auto", border: "none" }} />

      {items.map(({ student }) => {
        return (
          <div style={{ height: hide ? "0" : "auto", overflow: "hidden", padding: 0, border: "none" }} key={student.id}>
            <StudentCellView key={student.name} student={student} onEdit={() => onEdit(student)} />
          </div>
        )
      })}
    </>
  )
}
