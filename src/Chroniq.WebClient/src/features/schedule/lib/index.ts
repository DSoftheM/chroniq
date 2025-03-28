import dayjs from "dayjs"
import { classesToDictionary, toDateOnly } from "@/features/main/lib"
import { Lesson } from "@/features/main/types/lesson"
import { DateTime } from "@/features/main/types/lib"
import { Period } from "@/features/main/types/period"
import { ScheduleItem } from "@/features/main/types/schedule"
import { Student } from "@/features/main/types/student"

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
