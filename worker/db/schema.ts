import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const monitors = sqliteTable("monitor", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  scheduleSeconds: integer("schedule_s").notNull(),
  gracePeriodSeconds: integer("grace_period_s").notNull(),
  lastPingAt: integer("last_ping_at"),
  status: text("status", { enum: ["pending", "up", "down"] })
    .notNull()
    .default("pending"),
})
