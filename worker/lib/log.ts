export async function logOnError(
  callback: () => Promise<void>,
  message: string,
) {
  try {
    await callback()
  } catch (error) {
    console.error(message, error)
  }
}
