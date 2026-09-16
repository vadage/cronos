export function ago(timestamp: number | null) {
  if (timestamp === null) {
    return "never"
  }

  let elapsed = (new Date().getTime() - timestamp) / 1000
  if (elapsed < 60) {
    return "just now"
  }

  const unitNames = ["second", "minute", "hour", "day", "month", "year"]
  const unitThresholds = [60, 60, 24, 30, 12, 10]

  let unitIndex = 0
  for (; elapsed >= unitThresholds[unitIndex]!; unitIndex++) {
    elapsed /= unitThresholds[unitIndex]!
  }

  elapsed = Math.round(elapsed)

  return `${elapsed} ${unitNames[unitIndex]}${elapsed === 1 ? "" : "s"} ago`
}
