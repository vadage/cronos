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

<style>
  dialog[open] {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    width: min(32rem, 100% - 2rem);

    color: var(--foreground);
    background-color: var(--background);
  }
</style>
