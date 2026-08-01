<script lang="ts">
  import { getContext } from "svelte"
  import Button from "../Button.svelte"

  const dialogId = getContext<string>("dialog-id")
</script>

<Button command="close" commandfor={dialogId} aria-label="Close">
  &#10006;
</Button>
