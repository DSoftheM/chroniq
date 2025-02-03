import { PropsWithChildren } from "react"
import styled from "styled-components"

type Props = {
  onReachEnd?: () => void
  onReachStart?: () => void
} & React.HTMLAttributes<HTMLDivElement>

const Root = styled.div``

export function Scroll(props: PropsWithChildren<Props>) {
  const { children, onReachStart, onReachEnd, ...rest } = props

  return (
    <Root
      {...rest}
      onScroll={({ target }) => {
        const t = target as HTMLDivElement

        if (Math.round(t.scrollHeight - t.scrollTop) <= t.clientHeight + 1) {
          onReachEnd?.()
        }

        if (t.scrollTop === 0) {
          onReachStart?.()
        }
      }}
    >
      {children}
    </Root>
  )
}
