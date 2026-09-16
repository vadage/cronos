<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import Button from "../Button.svelte"

  type Props = {
    children?: Snippet
  }

  const { children }: Props = $props()

  const dialogId = getContext<string>("dialog-id")
</script>

<Button command="close" commandfor={dialogId} aria-label="Close">
  {#if children}
    {@render children()}
  {:else}
    &#10006;
  {/if}
</Button>
