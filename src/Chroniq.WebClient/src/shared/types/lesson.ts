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
    id: crypto.randomUUID(),
    date: Date.now() as DateTime,
    price: 1500,
    description: "",
    duration: "01:00:00",
    paid: false,
    ...lesson,
    student: lesson.student,
  }
}
