<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLButtonAttributes } from "svelte/elements"

  type Props = {
    type?: string
    children: Snippet
  } & HTMLButtonAttributes

  const { type, children, ...rest }: Props = $props()
</script>

<button type={type ?? "button"} {...rest}>{@render children()}</button>

<style>
  button {
    color: var(--primary);
    font-weight: 600;
    background: none;
    border: none;
    padding: 5px 10px;
  }
</style>
