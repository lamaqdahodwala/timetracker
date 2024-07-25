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
	<p class="btn flex btn-error flex-row gap-1 font-bold text-gray-800">
		<IconTrash stroke={1.5} size={20}></IconTrash> Delete Column
	</p>
</button>

{#if initialClick}
	<p>Are you sure?</p>
	<button on:click={() => (initialClick = false)} class="btn rounded-lg btn-neutral text-white p-2">Cancel</button>
	<button class="rounded-lg btn-error p-2 text-gray-800 btn" on:click={sendRequest}>Yes</button>
{/if}
