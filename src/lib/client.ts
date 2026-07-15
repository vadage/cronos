import type { ApiType } from "../../worker"
import { hc } from "hono/client"

export const client = hc<ApiType>("/api")
