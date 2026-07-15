import { createMiddleware } from "hono/factory"
import { runWithEnv } from "../lib/context"

export const withEnv = createMiddleware(async (c, next) =>
  runWithEnv(c.env, next),
)
