# Cronos

Bare minimum alerting on missed cron schedules.

## About

It started because I found myself regularly checking in on my backups whether they're still being written successfully,
which got boring real fast.

So initially, I decided to one-shot it with AI and call it a day. The thing that kept bothering me was how
overcomplicated the planned schema and code looked. This led to me stripping it down to the essentials and building it
by hand, using AI as reference for Hono and drizzle, since I wasn't familiar with this stack I wanted to try.

Cronos runs fully on the Cloudflare Platform and fits nicely into their Free tier. The stack is a Hono backend talking to D1
via drizzle and a Svelte frontend.

## Deploying

Cronos is meant to be deployed behind Cloudflare One, so no user management is needed on the app's side. Do this first,
or else unauthorized parties can access your instance and make mutations to your monitors.
For pings, you can either allow by your server IP(s) or use service credentials.

Pushing to the `main` branch triggers the deployment with migrations after checks have passed. Required secrets are:

| Secret                 | Description                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `DISCORD_WEBHOOK_URL`  | Where alerts are being sent to. Supports only Discord-compatible request schema.                            |
| `CLOUDFLARE_API_TOKEN` | Token with `Workers Scripts:Edit`, `D1:Edit`, `Workers Routes:Edit` and `Account Settings:Read` permissions |

## Usage

Add a new monitor and fill in these fields:

| Field        | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Name         | A descriptive name for your monitor. E.g. "DB-1 Backup (daily)"                                                                 |
| Schedule     | Your expected schedule in seconds. A schedule like "MO-FR" needs to cover the longest gap between runs --> `259200` for 3 days. |
| Grace period | How many seconds extra you allow after the expected schedule, before marking it as "down".                                      |

After saving, click "Copy cURL" and paste the command at the very end of your cronjob. Keep in mind that only successful
runs should send a ping.

An example ping cURL command looks like this: `curl https://cronos.yourdomain.com/api/ping/v1A9qCcqcrio8i_V7sCbB` (`GET` only)

## Caveats

Monitors need to get pinged at least once before they can alert. Otherwise, they'd just stay on "pending" forever.

Pings can trigger failure and recovery in a single request when being late but before the report schedule
(every 5 minutes per default) picks them up. In rare cases both the ping and schedule handler will send each a failure
alert, but the late pings won't go silent.

Cronos is intentionally unaware of timezones, which means your cronjobs shouldn't run on wall-clock time, or you need
to loosen the grace period to account for daylight saving time.
