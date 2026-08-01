<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLButtonAttributes } from "svelte/elements"

  type Props = {
    children: Snippet
  } & HTMLButtonAttributes

  const { children, ...rest }: Props = $props()
</script>

<button type="button" {...rest}>{@render children()}</button>
