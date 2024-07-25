<script lang="ts">
	import IconTrash from '@tabler/icons-svelte/IconTrash.svelte';
	export let columnId: number;
	export async function getTarget() {
		let res = await fetch(`/api/getTargetString?columnId=${columnId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return await res.json();
	}

	let targetAmount: any;
	let targetPeriod: any;
	let buttonText = 'Create Goal';

	async function createNewTarget() {
		if (!targetAmount || !targetPeriod) return;
		let res = await fetch('/api/setTarget', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				colId: columnId,
				timePeriod: targetPeriod,
				target: targetAmount
			})

		});

		let json = await res.json();

		buttonText = 'Created!';

		setTimeout(() => {
			buttonText = 'Create Goal';
		}, 2000);

    refetch()
		return json;
	}

	async function deleteTarget() {
		await fetch('/api/deleteTarget', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
      body: JSON.stringify({
        columnId: columnId
      })
		});

    await refetch()
	}

	let fetcher = getTarget();

	export function refetch() {
		fetcher = getTarget();
	}
  
</script>

<div class="text-right text-xs">
	{#await fetcher}
		<p>...</p>
	{:then data}
		{#if !data.targetString}
			<div class="dropdown bg-base-200">
				<div tabindex="0" role="button" class="m-1">Set Target</div>
				<div
					tabindex="0"
					role="button"
					class="menu dropdown-content z-10 rounded-box bg-base-200 p-2 shadow"
				>
					<p class="text-left">I should get...</p>
					<div class="flex flex-row items-center gap-3">
						<input
							type="number"
							class="input input-sm input-bordered font-bold"
							name=""
							id=""
							bind:value={targetAmount}
						/>
						<span class="divider">per</span>
						<select class="select" bind:value={targetPeriod}>
							<option disabled selected>Period</option>
							<option>day</option>
							<option>week</option>
							<option>month</option>
						</select>
					</div>
					<button class="btn btn-primary btn-sm" on:click={createNewTarget}>{buttonText}</button>
				</div>
			</div>
		{:else}
			<div class="flex flex-row items-center justify-end gap-3">
				<p class="{data.isOverTarget ? 'text-orange-300' : ''}">{data.targetString}</p>
				<button on:click={deleteTarget}>
					<IconTrash stroke={1} size={16} />
				</button>
			</div>
		{/if}
	{/await}
</div>
