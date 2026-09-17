import { Hono } from "hono"
import { withEnv } from "./middleware/env"
import { pingRouter } from "./routes/ping"
import { monitorsRouter } from "./routes/monitors"
import { handleScheduled } from "./scheduled"
import { realtimeRouter } from "./routes/realtime"

const apiRouter = new Hono()
  .use(withEnv)
  .route("/ping", pingRouter)
  .route("/monitors", monitorsRouter)
  .route("/realtime", realtimeRouter)

const app = new Hono().route("/api", apiRouter)

export default {
  fetch: app.fetch,
  scheduled: handleScheduled,
} satisfies ExportedHandler<Env>

export type ApiType = typeof apiRouter

export { RealtimeHub } from "./realtime/hub"
