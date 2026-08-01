import type { InferRequestType, InferResponseType } from "hono"
import type { client } from "../lib/client"

export type MonitorBody = InferRequestType<typeof client.monitors.$post>["json"]

export type Monitor = InferResponseType<typeof client.monitors.$get>[number]
