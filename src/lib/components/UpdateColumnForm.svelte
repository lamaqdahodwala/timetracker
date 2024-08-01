<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import DeleteColumnButton from './DeleteColumnButton.svelte';
	import FactorDisplayer from './FactorDisplayer.svelte';

	let dispatch = createEventDispatcher();

	export let colId: number;
	let colName = '';
	let colType = 'additive';
	let threshold = 0;
	let isThresholdBest = 1;
	let factor = 1;
	let stackCheckbox: HTMLInputElement;
	let stackable: boolean;

	let fetchColInfo = async () => {
		let res = await fetch(`/api/getColumnInfo/${colId}`);
		let json = await res.json();

		colType = json.type;
		factor = json.factor;
		if (json.threshold === -1) {
			isThresholdBest = 1;
			threshold = 0;
		} else {
			isThresholdBest = 0;
			threshold = json.threshold;
		}
		colName = json.name;

		stackable = json.stackable; //? 1 : 0
	};

	onMount(fetchColInfo);

	async function submitFormAndCreateColumn() {
		if (threshold < 0) {
			threshold = 0;
		}
		if (isThresholdBest) {
			threshold = -1;
		}

		if (factor < 1) {
			factor = 1;
		}
		let res = await fetch('/api/updateColumn', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				colName: colName,
				threshold: threshold,
				colType: colType,
				factor: factor,
				stackable: stackCheckbox?.checked ? '1' : '0',
				colId: colId
			})
		});

		// res
		// 	.then(() => {
		// 		dispatch('refetchData');
		// 	})
		// 	.then(() => fetchColInfo());
		//

		dispatch('refetchData');
		await fetchColInfo();
		dispatch('close');
	}
</script>

<form on:submit|preventDefault={submitFormAndCreateColumn}>
	<div>
		<input type="text" bind:value={colName} />
		{#each ['additive', 'subtractive', 'multiplicative', 'divisive'] as col}
			<p><label><input type="radio" bind:group={colType} value={col} /> {col}</label></p>
		{/each}
		<p>
			<label>
				<input type="radio" bind:group={isThresholdBest} value={1} />
				Personal Best
			</label>
		</p>
		<p>
			<label>
				<input type="radio" bind:group={isThresholdBest} value={0} />
				Custom: <input type="number" bind:value={threshold} />
			</label>
		</p>
		<p>
			<label
				>Factor: <FactorDisplayer
					{colType}
					factor={Number(factor)}
					on:updateFactor={(newFactor) => (factor = newFactor.detail.factor)}
				/>
        <input type="range" name="" id="" bind:value={factor} class="range">
			</label>
		</p>
		<p>
			<small
				>For multiplicative/divisive columns, the factor that will be multiplied/divided is the
				value shown plus 1.</small
			>
		</p>
		<p>
			<label
				>Stackable? <input
					type="checkbox"
					bind:this={stackCheckbox}
					value={1}
					checked={stackable}
				/></label
			>
		</p>
		<button type="submit">Update Column</button>
	</div>
</form>
<button on:click={() => dispatch('close')} class="btn">Close</button>
<DeleteColumnButton on:refetchData={() => dispatch('refetchData')} {colId}></DeleteColumnButton>
