import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { getDb, getMainHub } from "../lib/context"
import { monitors } from "../db/schema"
import { alertFailure, alertRecovery } from "../lib/alert"
import { logOnError } from "../lib/log"

export const pingRouter = new Hono().get("/:slug", async (c) => {
  const db = getDb()
  const { slug } = c.req.param()

  const [existing] = await db
    .select()
    .from(monitors)
    .where(eq(monitors.slug, slug))

  if (!existing) {
    return c.json({ error: "Monitor not found" }, 404)
  }

  const changes = {
    lastPingAt: Date.now(),
    status: "up",
  } satisfies Partial<typeof monitors.$inferInsert>

  await db
    .update(monitors)
    .set(changes)
    .where(eq(monitors.id, existing.id))
    .returning()

  const isLate =
    existing.lastPingAt &&
    Date.now() >
      existing.lastPingAt +
        existing.scheduleSeconds * 1000 +
        existing.gracePeriodSeconds * 1000

  if (existing.status === "down" || isLate) {
    if (existing.status !== "down") {
      await logOnError(
        () => alertFailure(existing.name),
        `Failed to alert failure for ${existing.id}.`,
      )
    }
    await logOnError(
      () => alertRecovery(existing.name),
      `Failed to alert recovery for ${existing.id}.`,
    )
  }

  await logOnError(
    () => getMainHub().publish("monitor/status", { ...existing, ...changes }),
    `Failed to publish status to main hub for ${existing.id}.`,
  )

  return c.body("ok")
})
