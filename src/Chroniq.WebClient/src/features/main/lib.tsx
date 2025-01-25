import { Lesson } from "./types/lesson"
import { DateTime } from "./types/lib"

export function classesToDictionary(classes: Lesson[]) {
  const res = classes.reduce((acc, classItem) => {
    if (!acc[toDateOnly(classItem.date)]) acc[toDateOnly(classItem.date)] = []
    acc[toDateOnly(classItem.date)].push(classItem)
    return acc
  }, {} as Record<string, Lesson[]>)

  return res
}

export function getPrevDay(date: Date) {
  return new Date(date.getTime() - 24 * 60 * 60 * 1000)
}

export function getNextDay(date: Date) {
  return new Date(date.getTime() + 24 * 60 * 60 * 1000)
}

export function isToday(date: DateTime | Date) {
  return new Date(date).toDateString() === new Date().toDateString()
}

export function toDateOnly(date: DateTime | Date) {
  if (date instanceof Date) return date.toLocaleDateString("ru", { month: "short", day: "numeric", year: "numeric" })
  return new Date(date).toLocaleDateString("ru", { month: "short", day: "numeric", year: "numeric" })
}

export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
