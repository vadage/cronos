import { Hono } from "hono"
import { monitors } from "./db/schema"
import { eq } from "drizzle-orm"
import { alertFailure, alertRecovery } from "./lib/alert"
import { getDb, runWithEnv } from "./lib/context"

const app = new Hono<{ Bindings: Env }>()

app.use(async (c, next) => runWithEnv(c.env, next))

app.get("/api/ping/:slug", async (c) => {
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
        Number(existing.schedule) * 1000 +
        existing.gracePeriod * 1000

  if (existing.status === "down" || isLate) {
    if (existing.status !== "down") {
      await alertFailure(existing.name)
    }
    await alertRecovery(existing.name)
  }

  return c.body("ok")
})

export default app
