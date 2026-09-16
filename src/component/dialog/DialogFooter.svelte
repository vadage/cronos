<script lang="ts">
  import type { Snippet } from "svelte"

  type Props = {
    children: Snippet
  }

  const { children }: Props = $props()
</script>

<footer>{@render children()}</footer>

<style>
  footer {
    display: flex;
    justify-content: end;
    column-gap: 0.5rem;
  }
</style>
