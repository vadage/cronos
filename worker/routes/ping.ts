import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { getDb } from "../lib/context"
import { monitors } from "../db/schema"
import { alertFailure, alertRecovery } from "../lib/alert"

export const pingRouter = new Hono().get("/:slug", async (c) => {
  const db = getDb()
  const { slug } = c.req.param()

  const [existing] = await db
    .select()
    .from(monitors)
    .where(eq(monitors.slug, slug))

  if (!existing) {
    return c.notFound()
  }

  await db
    .update(monitors)
    .set({ lastPingAt: Date.now(), status: "up" })
    .where(eq(monitors.id, existing.id))

  const isLate =
    existing.lastPingAt &&
    Date.now() >
      existing.lastPingAt +
        existing.scheduleSeconds * 1000 +
        existing.gracePeriodSeconds * 1000

  if (existing.status === "down" || isLate) {
    if (existing.status !== "down") {
      await alertFailure(existing.name)
    }
    await alertRecovery(existing.name)
  }

  return c.body("ok")
})
