import { monitors } from "../db/schema"

type MonitorRow = typeof monitors.$inferSelect

export type RealtimeEvents = {
  "monitor/status": MonitorRow
}
