<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FactorDisplayer from './FactorDisplayer.svelte';

	let dispatch = createEventDispatcher();

	let colName = '';
	let colType = 'additive';
	let threshold = 0;
	let isThresholdBest = 1;
	let factor = '1';
	let stackCheckbox: HTMLInputElement;

	function submitFormAndCreateColumn() {
		if (threshold < 0) {
			threshold = 0;
		}
		if (isThresholdBest) {
			threshold = -1;
		}

		let fact = Number(factor);

		if (fact < 1) {
			fact = 1;
		}
		let res = fetch('/api/createColumn', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				colName: colName,
				threshold: threshold,
				colType: colType,
				factor: fact,
				stackable: stackCheckbox?.checked ? '1' : '0'
			})
		});

		res.then((value) => {
			dispatch('refetchData');
			colName = '';
			threshold = 0;
			(colType = 'additive'), (isThresholdBest = 1);
		});
	}

	function setFactor(newFactor: string) {
		factor = newFactor;
	}
</script>

<form on:submit|preventDefault={submitFormAndCreateColumn} class="rounded-xl p-4 shadow-lg">
	<label class="form-control">Column Name: <input type="text" bind:value={colName} class="input"/></label>
	<div class="form-control">{#each ['additive', 'subtractive', 'multiplicative', 'divisive'] as col}
		<p><label><input type="radio" bind:group={colType} value={col} class="radio"/> {col}</label></p>
	{/each}</div>
	<p class="form-control">
		<label>
			<input type="radio" bind:group={isThresholdBest} value={1} class="radio"/>
			Personal Best
		</label>
		<label>
			<input type="radio" bind:group={isThresholdBest} value={0} class="radio"/>
			Custom: <input type="number" bind:value={threshold} />
		</label>
	</p>
	<p>
		<label>
			<span class="flex flex-row gap-1"
				>Factor:
				<FactorDisplayer
					{colType}
					factor={Number(factor)}
					on:updateFactor={(factor) => setFactor(factor.detail.newFactor)}
				></FactorDisplayer></span
			>
			<input type="range" class="range" bind:value={factor} /></label
		>
	</p>
	<p class="form-control">
		<label
			>Stackable? <input
				type="checkbox"
				class="toggle"
				bind:this={stackCheckbox}
				value={1}
				checked={true}
			/></label
		>
	</p>
	<button type="submit">Create Column</button>
</form>
