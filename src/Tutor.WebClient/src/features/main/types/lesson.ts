import { uuid } from "../lib"
import { LessonStatus } from "./lesson-status"

export type Lesson = {
  id: string
  description: string
  status: LessonStatus
  date: Date
  price: number
  paid: boolean
}

export function createLesson(lesson?: Partial<Lesson>): Lesson {
  return {
    id: uuid(),
    status: LessonStatus.Scheduled,
    date: new Date(),
    price: 1500,
    description: "",
    paid: false,
    ...lesson,
  }
}
