import { Hono } from "hono"
import { withEnv } from "./middleware/env"
import { pingRouter } from "./routes/ping"
import { monitorsRouter } from "./routes/monitors"

const apiRouter = new Hono()
  .use(withEnv)
  .route("/ping", pingRouter)
  .route("/monitors", monitorsRouter)

const app = new Hono().route("/api", apiRouter)

export default app

export type ApiType = typeof apiRouter
