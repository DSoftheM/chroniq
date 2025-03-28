import { CaretLeftOutlined, CaretRightOutlined, EditOutlined } from "@ant-design/icons"
import styled from "styled-components"
import { Avatar, Button, Flex, Typography } from "antd"
import { getColorById } from "@/shared/lib/color.lib"
import { Student } from "../types/student"

type Props = {
  student: Student
  hide?: boolean
  isFirst: boolean
  isLast: boolean
  onEdit: () => void
  onMove: (direction: "left" | "right") => void
}

const Actions = styled.div`
  opacity: 0;
  transition: all 0.3s ease 0s;
`

const Cell = styled.div<{ hide?: boolean }>`
  padding: ${(props) => (props.hide ? "0" : "5px")};
  border: 1px solid #000;

  &:hover ${Actions} {
    opacity: 1;
  }
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
      <Flex gap={20} align="center">
        <div>
          {s.avatarUrl ? (
            <Avatar size={80} src={s.avatarUrl} />
          ) : (
            <Avatar style={{ backgroundColor: getColorById(s.id) }} size={80}>
              {s.name[0].toUpperCase()}
            </Avatar>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0, alignSelf: "flex-start" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {s.name}
          </Typography.Title>
          <div>{s.defaultPrice}p</div>
          {s.description && <Ellipsis>{s.description}</Ellipsis>}
        </div>
        <Actions>
          {!props.isFirst && <Button type="text" icon={<CaretLeftOutlined />} onClick={() => props.onMove("left")} />}
          {!props.isLast && <Button type="text" icon={<CaretRightOutlined />} onClick={() => props.onMove("right")} />}
          <Button type="text" icon={<EditOutlined />} onClick={() => props.onEdit()} />
        </Actions>
      </Flex>
    </Cell>
  )
}
