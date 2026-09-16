<script lang="ts">
  import { client } from "./lib/client"
  import MonitorsSection from "./monitor/MonitorsSection.svelte"

  async function getMonitors() {
    const result = await client.monitors.$get()
    return result.json()
  }
</script>

<main>
  <h1>Monitors</h1>
  {#await getMonitors()}
    <p>Loading monitors...</p>
  {:then monitors}
    <MonitorsSection {monitors} />
  {:catch error}
    <p>Error loading monitors: {error.message}</p>
  {/await}
</main>

<style>
  main {
    max-width: 48rem;
    margin-inline: auto;
    padding: 1rem;
  }
</style>
