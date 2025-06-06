export type Student = {
  id: string
  name: string
  defaultPrice: number
  avatarUrl: string
  description: string
  isArchived: boolean
}

export function createStudent(student?: Partial<Student>): Student {
  return {
    id: crypto.randomUUID(),
    name: "",
    avatarUrl: "",
    description: "",
    defaultPrice: 1500,
    isArchived: false,
    ...student,
  }
}

export function isStudentValid(student: Student) {
  return student.name.length > 0 && student.defaultPrice > 0
}
