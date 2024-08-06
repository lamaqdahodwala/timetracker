<script lang="ts">
	import ColumnValue from '$lib/components/ColumnValue.svelte';
	import CreateColumnButton from '$lib/components/CreateColumnButton.svelte';
	import CreateColumnForm from '$lib/components/CreateColumnForm.svelte';
	import type { PageData } from './$types';
	import type { TodaysStats } from './api/getTodaysStats/GetTodaysStats';
	import DeleteColumnButton from '$lib/components/DeleteColumnButton.svelte';
	import Graph from '$lib/components/Graph.svelte';
	import ScoreStatsOnHover from '$lib/components/ScoreStatsOnHover.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import { onMount } from 'svelte';
	import { DateTime } from 'luxon';

	export let data: PageData;
	$: columns = data.todaysStats.columns || [];

	let refetching = '';
	let timeout: any;
	let todaysScore: number = data.score;
	onMount(() => {
		fetch('/api/firstTimeSetOffset', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
      body: JSON.stringify({
        offset: DateTime.fromJSDate(new Date()).zoneName
      } )
		});
	});
	async function refetchData() {
		clearTimeout(timeout);
		refetching = 'Saving...';
		let res = await fetch('/api/getTodaysStats', {
			method: 'GET',
			cache: 'no-cache'
		});
		let json: TodaysStats = await res.json();

		let scoreRes = await fetch('/api/calculateScore');
		let score = await scoreRes.json();
		todaysScore = score.score;

		columns = json.columns;

		refetching = 'Saved';
		timeout = setTimeout(() => (refetching = ''), 1000);
	}
</script>

<div class="rounded-xl p-16">
	<div
		class="grid grid-flow-row-dense place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
	>
		{#each columns as i}
			<ColumnValue props={i} on:updatedColumn={refetchData}></ColumnValue>
		{/each}
		<CreateColumnButton on:refetchData={refetchData} />
	</div>
	<ScoreStatsOnHover {todaysScore}></ScoreStatsOnHover>
	<p class="text-sm text-gray-300">{refetching}</p>
	<div class="w-12"></div>
</div>

<Timer />
