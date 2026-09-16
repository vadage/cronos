<script lang="ts">
  import type { Snippet } from "svelte"

  type Props = {
    children: Snippet
  }

  const { children }: Props = $props()
</script>

<h2>{@render children()}</h2>

<style>
  h2 {
    margin: 0;
  }
</style>
