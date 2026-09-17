import type { RealtimeEvents } from "../../worker/realtime/events"
import { client } from "./client"

type EventName = keyof RealtimeEvents
type Handler<K extends EventName> = (data: RealtimeEvents[K]) => void

type RealtimeMessage<K extends EventName = EventName> = {
  [P in K]: { name: P; data: RealtimeEvents[P] }
}[K]

const listeners: { [K in EventName]: Set<Handler<K>> } = {
  "monitor/status": new Set(),
}

export function subscribe<K extends keyof RealtimeEvents>(
  name: K,
  handler: Handler<K>,
) {
  listeners[name].add(handler)

  return () => listeners[name].delete(handler)
}

function dispatch<K extends EventName>(msg: RealtimeMessage<K>) {
  listeners[msg.name].forEach((handler) => handler(msg.data))
}

let currentTry = 1
function connect() {
  const ws = new WebSocket(client.realtime.main.$url())

  ws.onmessage = (event) => {
    dispatch(JSON.parse(event.data) as RealtimeMessage)
  }

  ws.onclose = () => {
    const timeoutSeconds = Math.min(2 ** (currentTry - 1), 30)

    currentTry++
    console.log(`[Realtime] Connection lost, retrying in ${timeoutSeconds}s...`)
    setTimeout(connect, timeoutSeconds * 1000)
  }

  ws.onopen = () => {
    console.log("[Realtime] Connection established")
    currentTry = 1
  }
}

connect()
