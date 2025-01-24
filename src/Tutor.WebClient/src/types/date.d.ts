import { DateTime } from "../features/main/types/lib"

declare global {
  interface Date {
    /** Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC. */
    getTime(): DateTime
  }
}
