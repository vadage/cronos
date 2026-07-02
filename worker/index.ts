import {Hono} from "hono";
import { drizzle } from "drizzle-orm/d1";

const app = new Hono<{Bindings: Env; Variables: { db: ReturnType<typeof drizzle> }}>()

app.use('*', async (c,next) => {
    c.set('db', drizzle(c.env.DB))
    await next()
})

app.get('/api/ping/:slug', c => {
    const { slug } = c.req.param()
    return c.text(slug)
})

export default app
