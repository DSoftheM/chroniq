import { ClassStatus } from "./class-status"

export type Class = {
  status: ClassStatus
  date: Date
  price: number
  paid: boolean
}
