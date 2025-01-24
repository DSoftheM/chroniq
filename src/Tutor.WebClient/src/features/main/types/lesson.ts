import { now, uuid } from "../lib"
import { DateTime } from "./lib"
import { Student } from "./student"

export type Lesson = {
  id: string
  description: string
  date: DateTime
  price: number
  paid: boolean
  student: Student
  duration: string
}

export function createLesson(lesson: Partial<Lesson> & { student: Student }): Lesson {
  return {
    id: uuid(),
    date: now(),
    price: 1500,
    description: "",
    duration: "01:00",
    paid: false,
    ...lesson,
    student: lesson.student,
  }
}
