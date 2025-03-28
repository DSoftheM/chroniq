import dayjs from "dayjs"
import { classesToDictionary, toDateOnly } from "../../main/lib"
import { Lesson } from "../../main/types/lesson"
import { DateTime } from "../../main/types/lib"
import { Period } from "../../main/types/period"
import { ScheduleItem } from "../../main/types/schedule"
import { Student } from "../../main/types/student"

export function processScheduleItems(scheduleItems: ScheduleItem[]) {
  const dict: { [studentId: string]: { [dateOnly: string]: Lesson[] } } = {}

  scheduleItems.forEach(({ student, lessons }) => {
    dict[student.id] = classesToDictionary(lessons)
  })

  return {
    getLessons(student: Student, date: DateTime) {
      return dict[student.id]?.[toDateOnly(date)] ?? []
    },
  }
}

export function getDaysForView(pageParams: Period[]) {
  const firstDay = dayjs((pageParams[0] as Period).start)
  const lastDay = dayjs((pageParams.at(-1) as Period).end)
  const days = Array.from({ length: lastDay.diff(firstDay, "day") + 1 }, (_, i) => firstDay.add(i, "day"))

  return days
}
