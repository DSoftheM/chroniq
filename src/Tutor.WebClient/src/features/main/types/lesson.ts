import { LessonStatus } from "./lesson-status"

export type Lesson = {
  status: LessonStatus
  date: Date
  price: number
  paid: boolean
}
