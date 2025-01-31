import { nav } from "@/lib/nav"
import { useMatches } from "react-router-dom"

export function useIsArchiveRoute() {
  const matches = useMatches()
  return matches.at(-1)?.pathname === nav.archive
}
