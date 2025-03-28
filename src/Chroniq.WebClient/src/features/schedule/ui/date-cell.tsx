import { isToday, toDateOnly } from "@/features/main/lib"
import { S } from "@/features/main/ui/styled"
import { DateTime } from "@/features/main/types/lib"

type Props = {
  date: DateTime
  isHoliday: boolean
}

export function DateCell(props: Props) {
  return (
    <S.DateCell $isToday={isToday(props.date)} $isHoliday={props.isHoliday}>
      <p>{toDateOnly(props.date)}</p>
      <p>{new Date(props.date).toLocaleDateString("ru", { weekday: "long" })}</p>
    </S.DateCell>
  )
}
