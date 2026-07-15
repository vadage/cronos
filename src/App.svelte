<script lang="ts">
  import { client } from "./lib/client"

  async function getMonitors() {
    const result = await client.monitors.$get()
    return result.json()
  }
</script>

{#await getMonitors()}
  <p>Loading monitors...</p>
{:then monitors}
  <p>{monitors.length} monitors</p>
  {#each monitors as monitor (monitor.id)}
    <p>{monitor.name}</p>
  {/each}
{:catch error}
  <p>Error loading monitors: {error.message}</p>
{/await}
