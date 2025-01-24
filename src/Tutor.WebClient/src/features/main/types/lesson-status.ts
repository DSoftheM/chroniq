import { Lesson } from "./lesson"

export enum LessonStatus {
  Scheduled = "Scheduled",
  InProgress = "InProgress",
  Completed = "Completed",
}

export function getLessonStatus(lesson: Lesson) {
  const now = new Date()
  const [h, m] = lesson.duration.split(":").map(Number)
  const endLesson = new Date(lesson.date + h * 60 * 60 * 1000 + m * 60 * 1000)

  if (endLesson < now) return LessonStatus.Completed
  if (now < endLesson) return LessonStatus.Scheduled
  return LessonStatus.InProgress
}
