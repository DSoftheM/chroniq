import dayjs from "dayjs"
import { Period } from "../features/main/types/period"
import { DateTime } from "../features/main/types/lib"

export function toRoundedPeriod(_period: Period) {
  return {
    start: (dayjs(_period.start).set("hour", 0).set("minute", 0).set("second", 0).unix() * 1000) as DateTime,
    end: (dayjs(_period.end).set("hour", 23).set("minute", 59).set("second", 59).unix() * 1000) as DateTime,
  }
}
