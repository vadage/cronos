import {getEnv} from "./context";

// Alerts could also be published over WebSockets for realtime updates in the frontend.
// Discord Webhooks are fast enough to not require a message queue. This might change with multiple alert channels in the future.

export async function alertFailure(name: string) {
    const webhookUrl = getEnv().DISCORD_WEBHOOK_URL
    if (!webhookUrl) {
        return
    }

    await sendWebhookUrl(webhookUrl, `🛑 ${name}`, 'The monitor did not report back in time.', 16711680)
}

export async function alertRecovery(name: string) {
    const webhookUrl = getEnv().DISCORD_WEBHOOK_URL
    if (!webhookUrl) {
        return
    }

    await sendWebhookUrl(webhookUrl, `✅ ${name}`, 'The monitor is now on schedule.', 65280)
}

async function sendWebhookUrl(url: string, title: string, description: string, color: number) {
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            embeds: [
                {
                    title,
                    description,
                    color,
                    timestamp: new Date().toISOString(),
                },
            ],
        })
    })
}
