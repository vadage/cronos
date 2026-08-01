<script lang="ts">
  import { getContext } from "svelte"
  import type { Snippet } from "svelte"

  type Props = {
    children: Snippet
  }

  const { children }: Props = $props()

  const dialogId = getContext<string>("dialog-id")
</script>

<dialog id={dialogId}>
  {@render children()}
</dialog>
