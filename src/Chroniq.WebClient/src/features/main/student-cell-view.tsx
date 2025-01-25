import { EditFilled } from "@ant-design/icons"
import { Student } from "./types/student"
import styled from "styled-components"
import { Avatar, Flex } from "antd"

type Props = {
  student: Student
  hide?: boolean
  onEdit: () => void
}

const Cell = styled.div<{ hide?: boolean }>`
  padding: ${(props) => (props.hide ? "0" : "5px")};
  background-color: slateblue;
`

const Ellipsis = styled.div`
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
`

const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#87d068", "#108ee9", "#f50", "#2db7f5"]

function getColorById(id: string) {
  return colors[id.length % colors.length]
}

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
        <div style={{ flex: 1 }}>
          <div>{s.name}</div>
          <div>{s.defaultPrice}p</div>
          {s.description && <Ellipsis>{s.description}</Ellipsis>}
        </div>
        <EditFilled onClick={() => props.onEdit()} />
      </Flex>
    </Cell>
  )
}
