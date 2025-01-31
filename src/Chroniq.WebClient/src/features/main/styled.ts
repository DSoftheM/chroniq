import styled from "styled-components"
import { Button } from "antd"
import { Scroll } from "../../components/scroll"
import { HideScroll } from "@/lib/styled.lib"

const Table = styled(Scroll)<{ $studentsCount: number }>`
  display: grid;
  grid-template-columns: 150px repeat(${(props) => props.$studentsCount}, minmax(100px, 1fr));
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

const DateCell = styled.div<{ $isToday: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => props.$isToday && `background-color: ${props.theme.green};`}
`

const EmptyCell = styled.div`
  padding: 0;
`

export const S = { Table, AddLessonButton, Cell, DateCell, EmptyCell }
