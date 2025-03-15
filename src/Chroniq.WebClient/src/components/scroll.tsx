import { PropsWithChildren } from "react"
import { useScrollDirection } from "./use-scroll-direction"

type Props = {
  onReachEnd?: () => void
  onReachStart?: () => void
} & React.HTMLAttributes<HTMLDivElement>

export function Scroll(props: PropsWithChildren<Props>) {
  const { children, onReachStart, onReachEnd, ...rest } = props

  const detect = useScrollDirection()

  return (
    <div
      {...rest}
      onScroll={(ev) => {
        const { isVerticalScroll, reachTop, reachBottom } = detect(ev)

        if (isVerticalScroll) {
          if (reachTop) onReachStart?.()
          if (reachBottom) onReachEnd?.()
        }
      }}
    >
      {children}
    </div>
  )
}
