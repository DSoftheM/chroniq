import axios, { AxiosError, HttpStatusCode } from "axios"
import { Schedule } from "../features/main/types/schedule"
import { Student } from "../features/main/types/student"
import { Lesson } from "../features/main/types/lesson"
import { Period } from "../features/main/types/period"
import { SaveSettingsData } from "./save-settings-data"
import { nav } from "@/lib/nav"

const http = axios.create({
  baseURL: "/api",
})

http.interceptors.response.use(undefined, (err: AxiosError) => {
  if (err.status === HttpStatusCode.Unauthorized) {
    window.location.href = "#" + nav.login
  }

  return Promise.reject(err)
})

export const api = {
  login: (login: string, password: string) => http.post("/auth/login", { login, password }),
  register: (login: string, password: string) =>
    http.post("/auth/register", { login, password }, { withCredentials: true }),
  logout: () => http.get("/auth/logout"),

  getSchedule: (period: Period, archived: boolean) =>
    http.post<Schedule>(`/schedule${archived ? "?archived=true" : ""}`, period).then((res) => res.data),

  createStudent: (student: Student) => http.post("/student", student),
  updateStudent: (student: Student) => http.post("/student/update", student),

  createLesson: (lesson: Lesson) => http.post("/lesson", lesson),
  updateLesson: (lesson: Lesson) => http.post("/lesson/update", lesson),
  deleteLesson: (lessonId: string) => http.get("/lesson/delete/" + lessonId),

  saveSettings: (data: SaveSettingsData) => http.post("/settings", data),

  deleteAllLessons: () => http.get("/admin/delete-all-lessons"),
  deleteAllStudents: () => http.get("/admin/delete-all-students"),
  applyMockData: () => http.get("/admin/apply-mock-data"),
}
