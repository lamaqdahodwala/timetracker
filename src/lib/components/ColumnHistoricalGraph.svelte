<script lang="ts">
	import Graph from './Graph.svelte';

	export let colId: number;

	async function getHistorical() {
		let request = await fetch(`/api/getHistoricalData/${colId}`);

		let json = await request.json();

		return json;
	}

	let historicalData: Promise<{ date: string; value: number }[]> = getHistorical();
</script>

{#await historicalData}
	<span class="loading loading-spinner"></span>
{:then data}
	<Graph graphClass="w-96 h-64" {data}></Graph>
{/await}
