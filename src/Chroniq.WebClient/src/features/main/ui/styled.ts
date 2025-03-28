import styled from "styled-components"
import { Button } from "antd"
import { Scroll } from "@/shared/ui/scroll"
import { HideScroll } from "@/shared/lib/styled.lib"

const Table = styled(Scroll)<{ $studentsCount: number }>`
  display: grid;
  grid-template-columns: 150px repeat(${(props) => props.$studentsCount}, minmax(400px, 1fr));
  position: relative;

  ${HideScroll}

  & > * {
    border: 1px solid #000;
    padding: 5px;
  }
`

const AddLessonButton = styled(Button)`
  width: 100%;
  opacity: 0;
  transition: all 0.3s ease 0s;
`

const Cell = styled.div`
  display: flex;

  &:hover ${AddLessonButton} {
    opacity: 1;
  }

  & > * {
    flex: 1;
  }
`

const DateCell = styled.div<{ $isToday: boolean; $isHoliday: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  ${(props) => props.$isToday && `background-color: ${props.theme.green};`}

  ${(props) => props.$isHoliday && `border: 3px solid #8288d9; border-radius: 5px;`}
`

const EmptyCell = styled.div`
  padding: 0;
`

export const S = { Table, AddLessonButton, Cell, DateCell, EmptyCell }
