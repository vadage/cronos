<script lang="ts">
  import type { Monitor, MonitorBody } from "./types"
  import DialogContent from "../component/dialog/DialogContent.svelte"
  import DialogHeader from "../component/dialog/DialogHeader.svelte"
  import DialogTitle from "../component/dialog/DialogTitle.svelte"
  import DialogClose from "../component/dialog/DialogClose.svelte"
  import DialogBody from "../component/dialog/DialogBody.svelte"
  import MonitorForm from "./MonitorForm.svelte"
  import DialogFooter from "../component/dialog/DialogFooter.svelte"
  import Dialog from "../component/dialog/Dialog.svelte"
  import DialogTrigger from "../component/dialog/DialogTrigger.svelte"
  import { client } from "../lib/client"
  import { untrack } from "svelte"

  type Props = {
    monitors: Monitor[]
  }

  const { monitors: initialMonitors }: Props = $props()
  let monitors = $state(untrack(() => initialMonitors))

  const DIALOG_ID = "monitor-dialog"
  const FORM_ID = "monitor-form"

  let editingMonitor: Monitor | undefined = $state()
  let formKey = $state(0)

  function openDialog(monitor?: Monitor) {
    editingMonitor = monitor
    formKey++
  }

  async function handleSubmit(values: MonitorBody) {
    if (editingMonitor) {
      const res = await client.monitors[":id"].$put({
        param: { id: String(editingMonitor.id) },
        json: values,
      })
      if (!res.ok) {
        return
      }

      const updated = await res.json()
      monitors = monitors.map((monitor) =>
        monitor.id === updated.id ? updated : monitor,
      )
    } else {
      const res = await client.monitors.$post({ json: values })
      if (!res.ok) {
        return
      }
      monitors.unshift(await res.json())
    }

    const dialog = document.getElementById(DIALOG_ID)
    if (dialog instanceof HTMLDialogElement) {
      dialog.close()
    }
  }
</script>

<Dialog id={DIALOG_ID}>
  <DialogTrigger onclick={() => openDialog()}>Add</DialogTrigger>

  {#each monitors as monitor (monitor.id)}
    <p>
      {monitor.name}
      <DialogTrigger onclick={() => openDialog(monitor)}>Edit</DialogTrigger>
    </p>
  {/each}

  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        {editingMonitor ? "Edit monitor" : "Add monitor"}
      </DialogTitle>
      <DialogClose />
    </DialogHeader>
    <DialogBody>
      {#key formKey}
        <MonitorForm
          id={FORM_ID}
          monitor={editingMonitor}
          onSave={handleSubmit}
        />
      {/key}
    </DialogBody>
    <DialogFooter>
      <input type="submit" value="Save" form={FORM_ID} />
    </DialogFooter>
  </DialogContent>
</Dialog>
