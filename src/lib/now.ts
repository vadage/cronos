import { createSubscriber } from "svelte/reactivity"

const subscribe = createSubscriber((update) => {
  const interval = setInterval(update, 30 * 1000)

  return () => clearInterval(interval)
})

export function now() {
  subscribe()
  return Date.now()
}
