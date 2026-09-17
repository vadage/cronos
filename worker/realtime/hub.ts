import { DurableObject } from "cloudflare:workers"
import type { RealtimeEvents } from "./events"

export class RealtimeHub extends DurableObject {
  fetch() {
    const { 0: client, 1: server } = new WebSocketPair()

    this.ctx.acceptWebSocket(server)

    return new Response(null, {
      status: 101,
      webSocket: client,
    })
  }

  publish<K extends keyof RealtimeEvents>(name: K, data: RealtimeEvents[K]) {
    const payload = JSON.stringify({ name, data })

    this.ctx.getWebSockets().forEach((ws) => {
      try {
        ws.send(payload)
      } catch {
        // socket is already closing, ignore
      }
    })
  }
}
