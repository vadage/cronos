<script lang="ts">
  import type { Monitor, MonitorBody } from "./types"
  import { untrack } from "svelte"

  type Props = {
    id: string
    monitor?: Monitor
    onSave: (data: MonitorBody) => void
  }

  const { id, monitor, onSave }: Props = $props()

  let name = $state(untrack(() => monitor?.name ?? ""))
  let scheduleSeconds = $state(
    untrack(() => monitor?.scheduleSeconds ?? 24 * 60 * 60),
  )
  let gracePeriodSeconds = $state(
    untrack(() => monitor?.gracePeriodSeconds ?? 60 * 60),
  )

  function onSubmit(e: SubmitEvent) {
    e.preventDefault()
    onSave({ name, scheduleSeconds, gracePeriodSeconds })
  }
</script>

<form {id} onsubmit={onSubmit}>
  <div>
    <label for="name">Name</label>
    <input
      name="name"
      type="text"
      id="name"
      required
      minlength="3"
      maxlength="32"
      bind:value={name}
    />
  </div>

  <div>
    <label for="schedule-seconds">Schedule (seconds)</label>
    <input
      name="scheduleSeconds"
      type="number"
      id="schedule-seconds"
      required
      min="60"
      step="60"
      bind:value={scheduleSeconds}
    />
  </div>

  <div>
    <label for="grace-period-seconds">Grace period (seconds)</label>
    <input
      name="gracePeriodSeconds"
      type="number"
      id="grace-period-seconds"
      required
      min="0"
      bind:value={gracePeriodSeconds}
    />
  </div>
</form>
