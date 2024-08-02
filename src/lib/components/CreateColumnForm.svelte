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

<form
	on:submit|preventDefault={submitFormAndCreateColumn}
	class="flex flex-col gap-1 rounded-xl p-4 shadow-lg "
>
	<div>
		<label class="form-control rounded-xl border border-neutral p-2">
			<p class="my-2 font-bold">Column Name</p>
			<input type="text" bind:value={colName} class="input" />
		</label>
	</div>
	<div>
		<div class="form-control rounded-xl border border-neutral p-2">
			<p class="my-2 font-bold flex flex-row items-center">Column Type</p>
			{#each ['additive', 'subtractive', 'multiplicative', 'divisive'] as col}
				<p>
					<label><input type="radio" bind:group={colType} value={col} class="radio" /> {col}</label>
				</p>
			{/each}
		</div>
	</div>
	<div>
		<div class="rounded-xl border border-neutral p-2">
			<p class="my-2 font-bold">Threshold</p>
			<p>
				<input type="radio" bind:group={isThresholdBest} value={1} class="radio" />
				Personal Best
			</p>
			<p>
				<input type="radio" bind:group={isThresholdBest} value={0} class="radio" />
				Custom: <input type="number" bind:value={threshold}/>
			</p>
		</div>
	</div>
	<div>
		<p class="rounded-xl border border-neutral p-2">
			<label>
				<span class="">
					<p class="my-2 font-bold">Factor</p>
					<FactorDisplayer
						{colType}
						factor={Number(factor)}
						on:updateFactor={(factor) => setFactor(factor.detail.newFactor)}
					></FactorDisplayer></span
				>
				<input type="range" class="range" bind:value={factor}/></label
			>
		</p>
	</div>
	<div>
		<p class="form-control rounded-xl border border-neutral p-2">
			<label class="flex flex-row gap-3">
				<p class="font-bold">Stackable?</p>
				<input
					type="checkbox"
					class="toggle"
					bind:this={stackCheckbox}
					value={1}
					checked={true}
				/></label
			>
		</p>
	</div>
	<button type="submit" class="btn btn-primary btn-outline">Create Column</button>
</form>
