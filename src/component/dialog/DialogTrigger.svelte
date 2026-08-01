<script lang="ts">
  import { type ComponentProps, getContext } from "svelte"
  import Button from "../Button.svelte"
  import type { Snippet } from "svelte"

  type Props = {
    children: Snippet
  } & ComponentProps<typeof Button>

  const { children, ...rest }: Props = $props()

  const dialogId = getContext<string>("dialog-id")
</script>

<Button command="show-modal" commandfor={dialogId} {...rest}>
  {@render children()}
</Button>
