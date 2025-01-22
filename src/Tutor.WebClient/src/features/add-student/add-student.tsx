import { Button, Input } from "antd"
import { useState } from "react"

const { TextArea } = Input

export function AddStudent() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [regularPrice, setRegularPrice] = useState(1500)

  return (
    <>
      <h1>Добавить ученика</h1>
      <Input placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
      <TextArea placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} />

      <Input placeholder="Цена" value={regularPrice} onChange={(e) => setRegularPrice(Number(e.target.value))} />

      <Button>Добавить</Button>
    </>
  )
}
