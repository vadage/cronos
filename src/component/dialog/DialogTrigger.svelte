<script lang="ts">
  import { type ComponentProps } from "svelte"
  import Button from "../Button.svelte"
  import type { Snippet } from "svelte"

  type Props = {
    children: Snippet
    for: string
  } & ComponentProps<typeof Button>

  const { children, for: target, ...rest }: Props = $props()
</script>

<Button command="show-modal" commandfor={target} {...rest}>
  {@render children()}
</Button>
