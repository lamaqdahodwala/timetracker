<script lang="ts">
	import Graph from './Graph.svelte';
	import { debounce } from 'lodash-es';

	export let todaysScore: number;

	async function getScoreData() {
		let res = await fetch('/api/getScoreHistoricalData');
		let json = await res.json();

		return json;
	}

	let updateHovering = debounce((e) => {
		isHovering = e;
	}, 200);
	let isHovering = false;
</script>

{#await getScoreData()}
	<p class="text-3xl">Today's score: {todaysScore}</p>
{:then data}
	<div class="dropdown dropdown-hover">
		<div role="button" tabindex="0" class="text-3xl">Today's score: {todaysScore}</div>
		<div class="dropdown-content menu">
			<div class="z-10 rounded-lg border m-2 border-gray-200 p-4 shadow-xl">
				<Graph {data} graphClass="w-96 h-64"></Graph>
			</div>
		</div>
	</div>
{/await}
