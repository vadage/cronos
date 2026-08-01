import { Hono } from "hono"
import { getDb } from "../lib/context"
import { monitors } from "../db/schema"
import * as z from "zod"
import { zValidator } from "@hono/zod-validator"
import { nanoid } from "nanoid"
import { eq } from "drizzle-orm"

const bodySchema = z.object({
  name: z.string().min(3).max(32),
  scheduleSeconds: z.number().int().min(60).multipleOf(60),
  gracePeriodSeconds: z.number().int().min(0),
})

const paramSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const monitorsRouter = new Hono()
  .get("/", async (c) => {
    const db = getDb()
    const rows = await db.select().from(monitors)

    return c.json(rows)
  })
  .post("/", zValidator("json", bodySchema), async (c) => {
    const data = c.req.valid("json")
    const db = getDb()

    const [row] = await db
      .insert(monitors)
      .values({
        ...data,
        slug: nanoid(),
      })
      .returning()

    return c.json(row)
  })
  .put(
    "/:id",
    zValidator("param", paramSchema),
    zValidator("json", bodySchema),
    async (c) => {
      const { id } = c.req.valid("param")
      const data = c.req.valid("json")
      const db = getDb()

      const [row] = await db
        .update(monitors)
        .set(data)
        .where(eq(monitors.id, id))
        .returning()

      if (!row) {
        return c.json({ error: "Monitor not found" }, 404)
      }

      return c.json(row)
    },
  )
  .delete("/:id", zValidator("param", paramSchema), async (c) => {
    const { id } = c.req.valid("param")
    const db = getDb()

    const [row] = await db
      .delete(monitors)
      .where(eq(monitors.id, id))
      .returning()

    if (!row) {
      return c.json({ error: "Monitor not found" }, 404)
    }

    return c.body(null, 204)
  })
