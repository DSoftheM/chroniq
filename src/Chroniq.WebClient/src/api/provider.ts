import axios from "axios"
import { Schedule } from "../features/main/types/schedule"
import { Student } from "../features/main/types/student"
import { Lesson } from "../features/main/types/lesson"
import { Period } from "../features/main/types/period"
import dayjs from "dayjs"

const http = axios.create({
  baseURL: import.meta.env.DEV ? `http://localhost:${import.meta.env.VITE_SERVER_PORT}/api` : "/api",
})

export const api = {
  login: (login: string, password: string) => http.post("/login", { login, password }),
  register: (login: string, password: string) => http.post("/register", { login, password }),
  getSchedule: (_period: Period) => {
    const period = {
      start: dayjs(_period.start).set("hour", 0).set("minute", 0).set("second", 0).unix() * 1000,
      end: dayjs(_period.end).set("hour", 23).set("minute", 59).set("second", 59).unix() * 1000,
    }
    return http.post<Schedule>("/schedule", period).then((res) => res.data)
  },

  createStudent: (student: Student) => http.post("/student", student),
  updateStudent: (student: Student) => http.post("/student/update", student),

  createLesson: (lesson: Lesson) => http.post("/lesson", lesson),
  updateLesson: (lesson: Lesson) => http.post("/lesson/update", lesson),
  deleteLesson: (lessonId: string) => http.get("/lesson/delete/" + lessonId),
}
