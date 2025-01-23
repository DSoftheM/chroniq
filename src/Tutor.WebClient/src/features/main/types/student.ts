import { uuid } from "../lib"
import { Lesson } from "./lesson"

export type Student = {
  id: string
  name: string
  defaultPrice: number
  avatarUrl: string
  description: string
  lessons: Lesson[]
}

export function createStudent(student?: Partial<Student>): Student {
  return { id: uuid(), name: "", avatarUrl: "", description: "", lessons: [], defaultPrice: 1500, ...student }
}
