import { Lesson } from "./lesson"
import { Student } from "./student"

export type Schedule = {
  items: ScheduleItem[]
}

export type ScheduleItem = {
  student: Student
  order: number
  lessons: Lesson[]
}
