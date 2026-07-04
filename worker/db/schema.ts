import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const monitors = sqliteTable("monitor", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  schedule: text("schedule").notNull(),
  gracePeriod: integer("grace_period").notNull(),
  lastPingAt: integer("last_ping_at"),
  status: text("status", { enum: ["pending", "up", "down"] })
    .notNull()
    .default("pending"),
})
