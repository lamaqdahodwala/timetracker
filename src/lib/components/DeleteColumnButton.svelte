<script lang="ts">
	import IconTrash from '@tabler/icons-svelte/IconTrash.svelte';
	import { createEventDispatcher } from 'svelte';
	let initialClick = false;

	export let colId: number;

	let dispatch = createEventDispatcher();

	async function sendRequest() {
		await fetch('/api/deleteColumn', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			cache: 'no-cache',
			body: JSON.stringify({
				colId: colId
			})
		});

		dispatch('refetchData');
	}
</script>

<button class="rounded-lg p-1" on:click={() => (initialClick = !initialClick)}>
	<p class="btn btn-error flex flex-row gap-1 font-bold text-gray-800">
		<IconTrash stroke={1.5} size={20}></IconTrash> Delete Column
	</p>
</button>

{#if initialClick}
	<div class="flex flex-col">
		<p class="font-bold">Are you sure?</p>

		<div class="join join-vertical">
			<button
				on:click={() => (initialClick = false)}
				class="btn btn-neutral rounded-lg p-2 text-white join-item">Cancel</button
			>
			<button class="btn btn-error rounded-lg p-2 text-gray-800 join-item font-bold" on:click={sendRequest}>Yes, delete all data</button>
		</div>
	</div>
{/if}
