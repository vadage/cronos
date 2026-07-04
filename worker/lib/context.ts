import { drizzle } from "drizzle-orm/d1"
import { AsyncLocalStorage } from "node:async_hooks"

const als = new AsyncLocalStorage<Env>()

export function runWithEnv<T>(env: Env, fn: () => T): T {
  return als.run(env, fn)
}

export function getEnv() {
  const env = als.getStore()
  if (!env) {
    throw new Error(
      "Function was called from a path that is not wrapped in `runWithEnv`",
    )
  }
  return env
}

export function getDb() {
  return drizzle(getEnv().DB)
}
