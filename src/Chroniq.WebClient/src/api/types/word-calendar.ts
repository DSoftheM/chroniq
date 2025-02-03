export type WordCalendar = {
  year: number
  months: Month[]
  transitions: Transition[]
  statistic: Statistic
}

type Month = {
  month: number
  days: string
}

type Transition = {
  from: string
  to: string
}

type Statistic = {
  workdays: number
  holidays: number
  hours40: number
  hours36: number
  hours24: number
}
