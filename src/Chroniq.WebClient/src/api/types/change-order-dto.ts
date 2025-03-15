export type ChangeOrderDTO = {
  items: ChangeOrderItemDTO[]
}

export type ChangeOrderItemDTO = {
  studentId: string
  order: number
}
