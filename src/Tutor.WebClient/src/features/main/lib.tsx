import { Lesson } from "./types/lesson"

export function classesToDictionary(classes: Lesson[]) {
  return classes.reduce((acc, classItem) => {
    acc[toDateOnly(classItem.date)] = classItem
    return acc
  }, {} as Record<string, Lesson>)
}

export function getPrevDay(date: Date) {
  return new Date(date.getTime() - 24 * 60 * 60 * 1000)
}

export function getNextDay(date: Date) {
  return new Date(date.getTime() + 24 * 60 * 60 * 1000)
}

export function isToday(date: Date) {
  return toDateOnly(date) === toDateOnly(new Date())
}

export function toDateOnly(date: Date) {
  return new Date(date).toLocaleDateString("ru", { month: "short", day: "numeric", year: "numeric" })
}

export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
