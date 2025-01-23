import axios from "axios"
import { Schedule } from "../features/main/types/schedule"
import { Student } from "../features/main/types/student"
import { Lesson } from "../features/main/types/lesson"

export const api = {
  login: (login: string, password: string) => axios.post("/login", { login, password }),
  register: (login: string, password: string) => axios.post("/register", { login, password }),
  getSchedule: () => axios.get<Schedule>("/schedule").then((res) => res.data),

  createStudent: (student: Student) => axios.post("/student", student),
  updateStudent: (student: Student) => axios.post("/student", student),

  createLesson: (lesson: Lesson) => axios.post("/lesson", lesson),
  updateLesson: (lesson: Lesson) => axios.post("/lesson", lesson),
}
