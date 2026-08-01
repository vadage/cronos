<script lang="ts">
  import { setContext, type Snippet, untrack } from "svelte"

  type Props = {
    id: string
    children: Snippet
  }

  const { id, children }: Props = $props()

  setContext(
    "dialog-id",
    untrack(() => id),
  )
</script>

{@render children()}
