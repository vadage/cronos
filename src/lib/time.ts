const unitsDescending = [
  { name: "year", seconds: 60 * 60 * 24 * 365 },
  { name: "month", seconds: 60 * 60 * 24 * 30 },
  { name: "day", seconds: 60 * 60 * 24 },
  { name: "hour", seconds: 60 * 60 },
  { name: "minute", seconds: 60 },
] as const

const formatter = new Intl.RelativeTimeFormat("en", { style: "long" })

export function ago(timestamp: number | null, now: number) {
  if (timestamp === null) {
    return "never"
  }

  const elapsed = (now - timestamp) / 1000
  const largestUnit = unitsDescending.find(({ seconds }) => elapsed >= seconds)
  if (!largestUnit) {
    return "just now"
  }

  return formatter.format(
    -Math.round(elapsed / largestUnit.seconds),
    largestUnit.name,
  )
}
