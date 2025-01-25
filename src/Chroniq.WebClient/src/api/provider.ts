import axios from "axios"
import { Schedule } from "../features/main/types/schedule"
import { Student } from "../features/main/types/student"
import { Lesson } from "../features/main/types/lesson"

const http = axios.create({
  baseURL: import.meta.env.DEV ? `http://localhost:${import.meta.env.VITE_SERVER_PORT}/api` : "/api",
})

export const api = {
  login: (login: string, password: string) => http.post("/login", { login, password }),
  register: (login: string, password: string) => http.post("/register", { login, password }),
  getSchedule: () => http.get<Schedule>("/schedule").then((res) => res.data),

  createStudent: (student: Student) => http.post("/student", student),
  updateStudent: (student: Student) => http.post("/student/update", student),

  createLesson: (lesson: Lesson) => http.post("/lesson", lesson),
  updateLesson: (lesson: Lesson) => http.post("/lesson/update", lesson),
  deleteLesson: (lessonId: string) => http.get("/lesson/delete/" + lessonId),
}
