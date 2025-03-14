import { EditFilled } from "@ant-design/icons"
import styled from "styled-components"
import { Avatar, Flex } from "antd"
import { getColorById } from "@/lib/color.lib"
import { Student } from "./types/student"

type Props = {
  student: Student
  hide?: boolean
  onEdit: () => void
}

const Cell = styled.div<{ hide?: boolean }>`
  padding: ${(props) => (props.hide ? "0" : "5px")};
  border: 1px solid #000;
`

const Ellipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export function StudentCellView(props: Props) {
  const s = props.student
  return (
    <Cell>
      <Flex gap={20}>
        <div>
          {s.avatarUrl ? (
            <Avatar size={80} src={s.avatarUrl} />
          ) : (
            <Avatar style={{ backgroundColor: getColorById(s.id) }} size={80}>
              {s.name[0].toUpperCase()}
            </Avatar>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div>{s.name}</div>
          <div>{s.defaultPrice}p</div>
          {s.description && <Ellipsis>{s.description}</Ellipsis>}
        </div>
        <EditFilled onClick={() => props.onEdit()} />
      </Flex>
    </Cell>
  )
}
