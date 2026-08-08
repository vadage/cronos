import { runWithEnv } from "../lib/context"
import { reportFailures } from "./failures"

export function handleScheduled(controller: ScheduledController, env: Env) {
  return runWithEnv(env, async () => {
    await reportFailures()
  })
}
