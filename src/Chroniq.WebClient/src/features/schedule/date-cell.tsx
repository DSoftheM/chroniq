import { isToday, toDateOnly } from "../main/lib"
import { S } from "../main/styled"
import { DateTime } from "../main/types/lib"

type Props = {
  date: DateTime
  isHoliday: boolean
}

export function DateCell(props: Props) {
  return (
    <S.DateCell $isToday={isToday(props.date)} style={{ color: props.isHoliday ? "red" : "" }}>
      <p>{toDateOnly(props.date)}</p>
      <p>{new Date(props.date).toLocaleDateString("ru", { weekday: "long" })}</p>
    </S.DateCell>
  )
}
