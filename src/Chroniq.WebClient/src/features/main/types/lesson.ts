import { uuid } from "../lib"
import { DateTime, TimeSpan } from "./lib"
import { Student } from "./student"

export type Lesson = {
  id: string
  description: string
  date: DateTime
  price: number
  paid: boolean
  student: Student
  duration: TimeSpan
}

export function createLesson(lesson: Partial<Lesson> & { student: Student }): Lesson {
  return {
    id: uuid(),
    date: Date.now(),
    price: 1500,
    description: "",
    duration: "01:00",
    paid: false,
    ...lesson,
    student: lesson.student,
  }
}
