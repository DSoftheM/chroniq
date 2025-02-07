import axios, { AxiosError, HttpStatusCode } from "axios"
import { Schedule } from "../features/main/types/schedule"
import { Student } from "../features/main/types/student"
import { Lesson } from "../features/main/types/lesson"
import { Period } from "../features/main/types/period"
import { SaveSettingsData } from "./save-settings-data"
import { nav } from "@/lib/nav"
import { WordCalendar } from "./types/word-calendar"

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
  getSettings: (data: SaveSettingsData) => http.get("/settings", data),

  deleteAllLessons: () => http.get("/admin/delete-all-lessons"),
  deleteAllStudents: () => http.get("/admin/delete-all-students"),
  applyMockData: () => http.get("/admin/apply-mock-data"),

  // getWorkCalendar: () =>
  //   axios.get<WordCalendar>("https://xmlcalendar.ru/data/ru/2025/calendar.json").then((res) => res.data),

  getWorkCalendar: (): WordCalendar => ({
    year: 2025,
    months: [
      {
        month: 1,
        days: "1,2,3,4,5,6,7,8,11,12,18,19,25,26",
      },
      {
        month: 2,
        days: "1,2,8,9,15,16,22,23",
      },
      {
        month: 3,
        days: "1,2,7*,8,9,15,16,22,23,29,30",
      },
      {
        month: 4,
        days: "5,6,12,13,19,20,26,27,30*",
      },
      {
        month: 5,
        days: "1,2+,3,4,8+,9,10,11,17,18,24,25,31",
      },
      {
        month: 6,
        days: "1,7,8,11*,12,13+,14,15,21,22,28,29",
      },
      {
        month: 7,
        days: "5,6,12,13,19,20,26,27",
      },
      {
        month: 8,
        days: "2,3,9,10,16,17,23,24,30,31",
      },
      {
        month: 9,
        days: "6,7,13,14,20,21,27,28",
      },
      {
        month: 10,
        days: "4,5,11,12,18,19,25,26",
      },
      {
        month: 11,
        days: "1*,2,3+,4,8,9,15,16,22,23,29,30",
      },
      {
        month: 12,
        days: "6,7,13,14,20,21,27,28,31+",
      },
    ],
    transitions: [
      { from: "01.04", to: "05.02" },
      { from: "02.23", to: "05.08" },
      { from: "03.08", to: "06.13" },
      { from: "11.01", to: "11.03" },
      { from: "01.05", to: "12.31" },
    ],
    statistic: {
      workdays: 247,
      holidays: 118,
      hours40: 1972,
      hours36: 1774.4,
      hours24: 1181.6,
    },
  }),
}
