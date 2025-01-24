import { uuid } from "../lib"
import { LessonStatus } from "./lesson-status"
import { Student } from "./student"

export type Lesson = {
  id: string
  description: string
  status: LessonStatus
  date: Date
  price: number
  paid: boolean
  student: Student
  duration: string
}

export function createLesson(lesson: Partial<Lesson> & { student: Student }): Lesson {
  return {
    id: uuid(),
    status: LessonStatus.Scheduled,
    date: new Date(),
    price: 1500,
    description: "",
    duration: "01:00",
    paid: false,
    ...lesson,
    student: lesson.student,
  }
}
