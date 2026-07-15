import { Hono } from "hono"
import { getDb } from "../lib/context"
import { monitors } from "../db/schema"

export const monitorsRouter = new Hono().get("/", async (c) => {
  const db = getDb()
  const rows = await db.select().from(monitors)

  return c.json(rows)
})
