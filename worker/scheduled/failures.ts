import { getDb, getMainHub } from "../lib/context"
import { monitors } from "../db/schema"
import { and, eq, sql } from "drizzle-orm"
import { alertFailure } from "../lib/alert"

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
    try {
      await alertFailure(monitor.name)
    } catch (error) {
      console.error(`alert failed for ${monitor.id}`, error)
    }

    try {
      await getMainHub().publish("monitor/status", monitor)
    } catch (error) {
      console.error(`main hub publish failed for ${monitor.id}`, error)
    }
  }
}
