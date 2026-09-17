import { Hono } from "hono"
import { getMainHub } from "../lib/context"

export const realtimeRouter = new Hono().get("/main", async (c) => {
  const upgradeHeader = c.req.header("Upgrade")
  if (upgradeHeader !== "websocket") {
    return c.body("Worker expected Upgrade: websocket", 426)
  }

  return getMainHub().fetch(c.req.raw)
})
