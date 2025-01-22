import React, { useState } from "react"
import styled from "styled-components"
import { LessonStatus } from "./types/lesson-status"
import { Student } from "./types/student"
import { Lesson } from "./types/lesson"
import { ClassItemView } from "./class-item-view"
import { Button, Modal, TimePicker, Input, Checkbox, InputNumber } from "antd"
import dayjs from "dayjs"

const { TextArea } = Input

const Table = styled.div<{ studentsCount: number }>`
  display: grid;
  grid-template-columns: 200px repeat(${(props) => props.studentsCount}, 1fr);
  gap: 10px;

  & > * {
    border: 1px solid #000;
  }
`

const students: Student[] = [
  {
    name: "John Doe",
    classes: [],
  },
  // {
  //   name: "John Doe",
  //   classes: [
  //     {
  //       status: ClassStatus.Scheduled,
  //       date: new Date("2025-01-20"),
  //       price: 100,
  //       paid: false,
  //     },
  //     {
  //       status: ClassStatus.InProgress,
  //       date: new Date("2025-01-22"),
  //       price: 100,
  //       paid: false,
  //     },
  //     {
  //       status: ClassStatus.InProgress,
  //       date: new Date("2025-01-29"),
  //       price: 100,
  //       paid: false,
  //     },
  //     {
  //       status: ClassStatus.Completed,
  //       date: new Date("2025-01-25"),
  //       price: 100,
  //       paid: false,
  //     },
  //   ],
  // },
  // {
  //   name: "Jane Doe",
  //   classes: [
  //     {
  //       status: ClassStatus.Completed,
  //       date: new Date(),
  //       price: 100,
  //       paid: true,
  //     },
  //     {
  //       status: ClassStatus.InProgress,
  //       date: new Date("2025-01-25"),
  //       price: 100,
  //       paid: false,
  //     },
  //   ],
  // },
]

export function Main() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  let today = getPrevDay(new Date())

  return (
    <>
      <Table studentsCount={students.length}>
        <div></div>

        {students.map((student) => {
          return (
            <React.Fragment key={student.name}>
              <div>{student.name}</div>
            </React.Fragment>
          )
        })}

        {Array.from({ length: 10 }).flatMap(() => {
          today = getNextDay(today)
          return (
            <React.Fragment key={toDateOnly(today)}>
              <div style={{ backgroundColor: isToday(today) ? "green" : "" }}>{toDateOnly(today)}</div>
              {students.map((student) => {
                const classes = classesToDictionary(student.classes)
                const classItem = classes[toDateOnly(today)]

                return (
                  <React.Fragment key={student.name}>
                    {classItem ? (
                      <ClassItemView classItem={classItem} />
                    ) : (
                      <div>
                        <Button onClick={() => setIsModalOpen(true)}>+</Button>
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })}
      </Table>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>Во сколько</p>
        <TimePicker format={"HH:mm"} minuteStep={15} onChange={console.log} />
        <p>Длительность</p>
        <TimePicker format={"HH:mm"} minuteStep={15} onChange={console.log} />
        <p>Стоимость</p>
        <InputNumber min={1} max={10} defaultValue={3} onChange={console.log} />
        <TextArea />
        <Checkbox onChange={console.log}>Оплачено</Checkbox>
      </Modal>
    </>
  )
}

function classesToDictionary(classes: Lesson[]) {
  return classes.reduce((acc, classItem) => {
    acc[toDateOnly(classItem.date)] = classItem
    return acc
  }, {} as Record<string, Lesson>)
}

function getPrevDay(date: Date) {
  return new Date(date.getTime() - 24 * 60 * 60 * 1000)
}

function getNextDay(date: Date) {
  return new Date(date.getTime() + 24 * 60 * 60 * 1000)
}

function isToday(date: Date) {
  return toDateOnly(date) === toDateOnly(new Date())
}

// function fillGapsInClasses(classes: Class[], targetLength: number): (Class | null)[] {
//     const _classes = [...classes].sort((a, b) => a.date.getTime() - b.date.getTime())
//     const result: (Class | null)[] = new Array(targetLength).fill(null)

//     for (let i = 0; i < targetLength; i++) {

//     }
//     return result

// }

function toDateOnly(date: Date) {
  // return date.toISOString().split("T")[0]
  return date.toLocaleDateString("ru", { month: "short", day: "numeric", year: "numeric" })
}
