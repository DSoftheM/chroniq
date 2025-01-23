import React from "react"
import styled from "styled-components"
import { ClassItemView } from "./class-item-view"
import { getPrevDay, getNextDay, toDateOnly, isToday, classesToDictionary } from "./lib"
import { useScheduleQuery } from "./api/use-schedule-query"
import { PlusOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { nav } from "../../lib/nav"
import { ContentPlaceholder } from "./content-placeholder"

const Table = styled.div<{ $studentsCount: number }>`
  display: grid;
  grid-template-columns: 200px repeat(${(props) => props.$studentsCount}, 1fr);
  gap: 10px;

  & > * {
    border: 1px solid #000;
  }
`

const EmptyCell = () => <div />

export function Main() {
  const scheduleQuery = useScheduleQuery()
  const navigate = useNavigate()

  let today = getPrevDay(new Date())

  if (scheduleQuery.isPending) return <div>Загрузка...</div>
  if (scheduleQuery.isError) return <div>Ошибка {scheduleQuery.error.message}</div>

  if (!scheduleQuery.data?.items.length) return <ContentPlaceholder />

  return (
    <>
      <Table $studentsCount={scheduleQuery.data?.items.length ?? 0}>
        <EmptyCell />

        {scheduleQuery.data?.items.map(({ student }) => {
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
              {scheduleQuery.data?.items.map(({ student, lessons }) => {
                const classes = classesToDictionary(lessons)
                const classItem = classes[toDateOnly(today)]

                return (
                  <React.Fragment key={student.name}>
                    {classItem ? (
                      <ClassItemView
                        classItem={classItem}
                        onEdit={() => navigate(nav.updateLesson(student.id, classItem.id))}
                      />
                    ) : (
                      <div>
                        <PlusOutlined onClick={() => navigate(nav.createLesson(student.id))} />
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })}
      </Table>
    </>
  )
}
