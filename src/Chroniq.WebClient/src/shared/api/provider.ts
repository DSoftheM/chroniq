import axios, { AxiosError, HttpStatusCode } from "axios"
import { Schedule } from "@/shared/types/schedule"
import { Student } from "@/shared/types/student"
import { Period } from "@/shared/types/period"
import { nav } from "@/shared/lib/nav"
import { WordCalendar } from "./types/word-calendar"
import { Settings } from "./types/settings"
import { ChangeOrderDTO } from "./types/change-order-dto"

class Api {
  // Аутентификация
  async login(login: string, password: string) {
    const response = await axios.post("/api/auth/login", { login, password })
    return response.data
  }

  async register(login: string, password: string) {
    const response = await axios.post("/api/auth/register", { login, password })
    return response.data
  }

  async logout() {
    await axios.get("/auth/logout")
  }

  // Расписание
  async getSchedule(period: Period) {
    const response = await axios.get<Schedule>("/api/schedule", {
      params: { start: period.start, end: period.end },
    })
    return response.data
  }

  async updateSchedule(schedule: Schedule) {
    const response = await axios.post("/api/schedule", schedule)
    return response.data
  }

  // Студенты
  async getStudents() {
    const response = await axios.get<Student[]>("/api/students")
    return response.data
  }

  async saveStudent(student: Student) {
    const response = await axios.post("/api/students", student)
    return response.data
  }

  // Настройки
  async getSettings() {
    const response = await axios.get<Settings>("/api/settings")
    return response.data
  }

  async saveSettings(settings: Settings) {
    const response = await axios.post("/api/settings", settings)
    return response.data
  }

  // Слова в календаре
  async getWordCalendar() {
    const response = await axios.get<WordCalendar[]>("/api/word-calendar")
    return response.data
  }

  // Изменение порядка
  async changeOrder(dto: ChangeOrderDTO) {
    const response = await axios.post("/api/schedule/change-order", dto)
    return response.data
  }
}

export const api = new Api()

// Обработчик ошибок и перенаправление при 401
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      window.location.hash = nav.login
    }
    return Promise.reject(error)
  }
)
