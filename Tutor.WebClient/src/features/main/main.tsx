import React from "react"
import styled from "styled-components"
import { ClassStatus } from "./types/class-status"
import { Student } from "./types/student"
import { Class } from "./types/class"
import { ClassItemView } from "./class-item-view"

const Table = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  gap: 10px;

  & * {
    border: 1px solid #000;
  }
`

const students: Student[] = [
  {
    name: "John Doe",
    classes: [
      {
        status: ClassStatus.Scheduled,
        date: new Date("2025-01-20"),
        price: 100,
        paid: false,
      },
      {
        status: ClassStatus.InProgress,
        date: new Date("2025-01-22"),
        price: 100,
        paid: false,
      },
      {
        status: ClassStatus.InProgress,
        date: new Date("2025-01-29"),
        price: 100,
        paid: false,
      },
      {
        status: ClassStatus.Completed,
        date: new Date("2025-01-25"),
        price: 100,
        paid: false,
      },
    ],
  },
  {
    name: "Jane Doe",
    classes: [
      {
        status: ClassStatus.Completed,
        date: new Date(),
        price: 100,
        paid: true,
      },
      {
        status: ClassStatus.InProgress,
        date: new Date("2025-01-25"),
        price: 100,
        paid: false,
      },
    ],
  },
]

export function Main() {
  let today = getPrevDay(new Date())

  return (
    <Table>
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
          <>
            <div>{toDateOnly(today)}</div>
            {students.map((student) => {
              const classes = classesToDictionary(student.classes)
              const classItem = classes[toDateOnly(today)]

              return (
                <React.Fragment key={student.name}>
                  {classItem ? <ClassItemView classItem={classItem} /> : <div>null</div>}
                </React.Fragment>
              )
            })}
          </>
        )
      })}
    </Table>
  )
}

function classesToDictionary(classes: Class[]) {
  return classes.reduce((acc, classItem) => {
    acc[toDateOnly(classItem.date)] = classItem
    return acc
  }, {} as Record<string, Class>)
}

function getPrevDay(date: Date) {
  return new Date(date.getTime() - 24 * 60 * 60 * 1000)
}

function getNextDay(date: Date) {
  return new Date(date.getTime() + 24 * 60 * 60 * 1000)
}

// function fillGapsInClasses(classes: Class[], targetLength: number): (Class | null)[] {
//     const _classes = [...classes].sort((a, b) => a.date.getTime() - b.date.getTime())
//     const result: (Class | null)[] = new Array(targetLength).fill(null)

//     for (let i = 0; i < targetLength; i++) {

//     }
//     return result

// }

function toDateOnly(date: Date) {
  return date.toISOString().split("T")[0]
}
