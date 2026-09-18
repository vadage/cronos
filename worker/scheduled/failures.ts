import { getDb, getMainHub } from "../lib/context"
import { monitors } from "../db/schema"
import { and, eq, sql } from "drizzle-orm"
import { alertFailure } from "../lib/alert"
import { logOnError } from "../lib/log"

export async function reportFailures() {
  const db = getDb()
  const now = Date.now()

  const newFailures = await db
    .update(monitors)
    .set({ status: "down" })
    .where(
      and(
        eq(monitors.status, "up"),
        sql`${monitors.lastPingAt} + (${monitors.scheduleSeconds} + ${monitors.gracePeriodSeconds}) * 1000 < ${now}`,
      ),
    )
    .returning()

  for (const monitor of newFailures) {
    await logOnError(
      () => alertFailure(monitor.name),
      `Failed to alert failure for ${monitor.id}.`,
    )

    await logOnError(
      () => getMainHub().publish("monitor/status", monitor),
      `Failed to publish status to main hub for ${monitor.id}.`,
    )
  }
}
