<script lang="ts">
	import { capitalize } from 'lodash-es';
	export let colId: number;

  import {FactorStringGenerator} from '$lib/helpers/DisplayFactor'

	let name: string;
	let factor: string;
	let threshold: string;
	let type: string;
	let stackable: string;

  let factorDisplayer: FactorStringGenerator
	async function fetchData() {
		let request = await fetch(`/api/getColumnInfo/${colId}`);
		let json = await request.json();

		name = json.name;
		factor = json.factor;
		type = capitalize(json.type);

		if (Number(json.threshold) === -1) {
			threshold = 'Personal Best';
		} else {
			threshold = json.threshold;
		}
		stackable = json.stackable ? 'Stackable' : 'Nonstackable';

    factorDisplayer = new FactorStringGenerator(type.toLowerCase(), Number( factor ))
	}
	let promise = fetchData();

</script>

{#await promise}
	<span class="loading loading-spinner"></span>
{:then}
	<div class="flex flex-row items-center justify-around gap-3 text-black dark:text-white">
		<p class="text-2xl font-bold">{name}</p>
		<div class="">
			<p class="text-left">{type}</p>
			<p class="text-left">Factor: {factorDisplayer.getFactorString()}
      </p>
			<p class="text-left">Threshold: {threshold}</p>
			<p class="text-left">{stackable}</p>
		</div>
	</div>
{/await}
