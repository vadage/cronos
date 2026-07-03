import {Hono} from "hono"
import {monitors} from "./db/schema"
import {eq} from "drizzle-orm"
import {alertRecovery} from "./lib/alert"
import {getDb, runWithEnv} from "./lib/context";

const app = new Hono<{ Bindings: Env }>()

app.use(async (c, next) => runWithEnv(c.env, next))

app.get('/api/ping/:slug', async c => {
    const db = getDb()
    const {slug} = c.req.param()

    const [existing] = await db.select()
        .from(monitors)
        .where(eq(monitors.slug, slug))

    if (!existing) {
        return c.notFound()
    }

    await db.update(monitors)
        .set({lastPingAt: Date.now(), status: 'up'})
        .where(eq(monitors.id, existing.id))

    // Should pings between grace period and scheduled handler count as incident?
    if (existing.status === 'down') {
        await alertRecovery(existing.name)
    }

    return c.body('ok')
})

export default app
