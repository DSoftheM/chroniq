import { isToday, toDateOnly } from "../../main/lib"
import { S } from "../../main/ui/styled"
import { DateTime } from "../../main/types/lib"

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
