import { useRef } from "react"

export function useScrollDirection() {
  const lastScroll = useRef({ left: 0, top: 0 })

  return (event: React.UIEvent<HTMLDivElement>) => {
    const t = event.target as HTMLDivElement

    const currentScrollLeft = t.scrollLeft
    const currentScrollTop = t.scrollTop

    const isHorizontalScroll = currentScrollLeft !== lastScroll.current.left
    const isVerticalScroll = currentScrollTop !== lastScroll.current.top

    lastScroll.current.left = currentScrollLeft
    lastScroll.current.top = currentScrollTop

    const reachTop = t.scrollTop === 0
    const reachBottom = Math.round(t.scrollHeight - t.scrollTop) <= t.clientHeight + 1

    return { isHorizontalScroll, isVerticalScroll, reachTop, reachBottom }
  }
}
