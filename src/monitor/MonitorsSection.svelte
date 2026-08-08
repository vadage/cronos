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
  import Button from "../component/Button.svelte"

  type Props = {
    monitors: Monitor[]
  }

  const { monitors: initialMonitors }: Props = $props()
  let monitors = $state(untrack(() => initialMonitors))

  const DIALOG_ID = "monitor-dialog"
  const FORM_ID = "monitor-form"
  const DELETE_DIALOG_ID = "monitor-delete-dialog"

  let editingMonitor: Monitor | undefined = $state()
  let formKey = $state(0)
  let deletingMonitor: Monitor | undefined = $state()

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

  function openDeleteDialog(monitor: Monitor) {
    deletingMonitor = monitor
  }

  async function handleDelete() {
    if (!deletingMonitor) {
      return
    }

    const res = await client.monitors[":id"].$delete({
      param: { id: String(deletingMonitor.id) },
    })
    if (!res.ok) {
      return
    }

    monitors = monitors.filter((monitor) => monitor !== deletingMonitor)

    const dialog = document.getElementById(DELETE_DIALOG_ID)
    if (dialog instanceof HTMLDialogElement) {
      dialog.close()
    }
  }
</script>

<DialogTrigger for={DIALOG_ID} onclick={() => openDialog()}>Add</DialogTrigger>

{#each monitors as monitor (monitor.id)}
  <p>
    {monitor.name}
    <DialogTrigger for={DIALOG_ID} onclick={() => openDialog(monitor)}>
      Edit
    </DialogTrigger>
    <DialogTrigger
      for={DELETE_DIALOG_ID}
      onclick={() => openDeleteDialog(monitor)}
    >
      Delete
    </DialogTrigger>
  </p>
{/each}

<Dialog id={DIALOG_ID}>
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

<Dialog id={DELETE_DIALOG_ID}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete dialog</DialogTitle>
    </DialogHeader>
    <DialogBody>
      {#if deletingMonitor}
        Do you really want to delete "{deletingMonitor.name}"? This action is
        irreversible.
      {/if}
    </DialogBody>
    <DialogFooter>
      <Button onclick={handleDelete}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
