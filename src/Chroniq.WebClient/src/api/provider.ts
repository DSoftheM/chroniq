import axios from "axios"
import { Schedule } from "../features/main/types/schedule"
import { Student } from "../features/main/types/student"
import { Lesson } from "../features/main/types/lesson"
import { Period } from "../features/main/types/period"

const http = axios.create({
  baseURL: import.meta.env.DEV ? `http://localhost:${import.meta.env.VITE_SERVER_PORT}/api` : "/api",
})

export const api = {
  login: (login: string, password: string) => http.post("/login", { login, password }),
  register: (login: string, password: string) => http.post("/register", { login, password }),

  getSchedule: (period: Period, archived: boolean) =>
    http.post<Schedule>(`/schedule${archived ? "?archived=true" : ""}`, period).then((res) => res.data),

  createStudent: (student: Student) => http.post("/student", student),
  updateStudent: (student: Student) => http.post("/student/update", student),

  createLesson: (lesson: Lesson) => http.post("/lesson", lesson),
  updateLesson: (lesson: Lesson) => http.post("/lesson/update", lesson),
  deleteLesson: (lessonId: string) => http.get("/lesson/delete/" + lessonId),

  deleteAllLessons: () => http.get("/admin/delete-all-lessons"),
  deleteAllStudents: () => http.get("/admin/delete-all-students"),
  applyMockData: () => http.get("/admin/apply-mock-data"),
}
