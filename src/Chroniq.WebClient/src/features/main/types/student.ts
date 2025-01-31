import { uuid } from "../lib"

export type Student = {
  id: string
  name: string
  defaultPrice: number
  avatarUrl: string
  description: string
}

export function createStudent(student?: Partial<Student>): Student {
  return { id: uuid(), name: "", avatarUrl: "", description: "", defaultPrice: 1500, ...student }
}

export function isStudentValid(student: Student) {
  return student.name.length > 0 && student.defaultPrice > 0
}
