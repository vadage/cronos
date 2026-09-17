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
  import SquareTerminal from "../icons/SquareTerminal.svelte"
  import Pencil from "../icons/Pencil.svelte"
  import Trash from "../icons/Trash.svelte"
  import Plus from "../icons/Plus.svelte"
  import { ago } from "../lib/time"
  import { now } from "../lib/now"
  import { subscribe } from "../lib/realtime"

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
    const target = deletingMonitor
    if (!target) {
      return
    }

    const res = await client.monitors[":id"].$delete({
      param: { id: String(target.id) },
    })
    if (!res.ok) {
      return
    }

    monitors = monitors.filter((monitor) => monitor.id !== target.id)

    const dialog = document.getElementById(DELETE_DIALOG_ID)
    if (dialog instanceof HTMLDialogElement) {
      dialog.close()
    }
  }

  async function copyCurl(monitor: Monitor) {
    const url = client.ping[":slug"].$url({ param: { slug: monitor.slug } })
    const command = `curl ${url}`

    await navigator.clipboard.writeText(command)
  }

  $effect(() =>
    subscribe("monitor/status", (updated) => {
      monitors = monitors.map((monitor) =>
        monitor.id === updated.id ? updated : monitor,
      )
    }),
  )
</script>

<DialogTrigger for={DIALOG_ID} onclick={() => openDialog()} title="Add">
  <Plus />
</DialogTrigger>

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Status</th>
        <th scope="col">Last Ping</th>
        <th scope="col" class="row-actions">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each monitors as monitor (monitor.id)}
        <tr>
          <td>{monitor.name}</td>
          <td>{monitor.status}</td>
          <td>{ago(monitor.lastPingAt, now())}</td>
          <td class="row-actions">
            <Button onclick={() => copyCurl(monitor)} title="Copy cURL">
              <SquareTerminal />
            </Button>
            <DialogTrigger
              for={DIALOG_ID}
              onclick={() => openDialog(monitor)}
              title="Edit"
            >
              <Pencil />
            </DialogTrigger>
            <DialogTrigger
              for={DELETE_DIALOG_ID}
              onclick={() => openDeleteDialog(monitor)}
              title="Delete"
            >
              <Trash />
            </DialogTrigger>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

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
      <DialogClose>Cancel</DialogClose>
      <Button type="submit" form={FORM_ID}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Dialog id={DELETE_DIALOG_ID}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete monitor</DialogTitle>
      <DialogClose />
    </DialogHeader>
    <DialogBody>
      {#if deletingMonitor}
        Do you really want to delete "{deletingMonitor.name}"? This action is
        irreversible.
      {/if}
    </DialogBody>
    <DialogFooter>
      <DialogClose>Cancel</DialogClose>
      <Button onclick={handleDelete}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<style>
  .table-wrapper {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 0.5rem 0.75rem;
    text-align: left;
    white-space: nowrap;
  }

  .row-actions {
    text-align: end;
  }
</style>
