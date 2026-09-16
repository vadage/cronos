<script lang="ts">
  import type { Snippet } from "svelte"

  type Props = {
    children: Snippet
  }

  const { children }: Props = $props()
</script>

<header>{@render children()}</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
  }
</style>
