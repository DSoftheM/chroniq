import { Lesson } from "./lesson"

export enum LessonStatus {
  Scheduled = "Scheduled",
  InProgress = "InProgress",
  Completed = "Completed",
}

export function getLessonStatus(lesson: Lesson) {
  const now = new Date()
  const [h, m] = lesson.duration.split(":").map(Number)
  const durationMinutes = h * 60 + m

  const start = new Date(lesson.date)
  const end = new Date(start.getTime() + durationMinutes * 60000)

  if (now < start) {
    return LessonStatus.Scheduled
  } else if (now >= start && now <= end) {
    return LessonStatus.InProgress
  } else {
    return LessonStatus.Completed
  }
}
