import { Lesson } from "./types/lesson"
import { DateTime } from "./types/lib"

export function classesToDictionary(classes: Lesson[]) {
  const res = classes.reduce((acc, classItem) => {
    const dateOnly = toDateOnly(classItem.date)

    if (!acc[dateOnly]) {
      acc[dateOnly] = []
    }
    acc[dateOnly].push(classItem)

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

export function isToday(date: DateTime | Date | string) {
  return new Date(date).toDateString() === new Date().toDateString()
}

export function toDateOnly(date: DateTime | Date) {
  if (date instanceof Date) return date.toLocaleDateString("ru", { month: "2-digit", day: "2-digit", year: "2-digit" })
  return new Date(date).toLocaleDateString("ru", { month: "2-digit", day: "2-digit", year: "2-digit" })
}

export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
