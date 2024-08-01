<script lang="ts">
	import { debounce } from 'lodash-es';
	import { createEventDispatcher, onMount } from 'svelte';
	import UpdateColumnForm from '$lib/components/UpdateColumnForm.svelte';
	import IconSettings from '@tabler/icons-svelte/IconSettings.svelte';
	import DeleteColumnButton from '$lib/components/DeleteColumnButton.svelte';
	import ColumnStatsOnHover from '$lib/components/ColumnStatsOnHover.svelte';
	import TargetDisplayer from './TargetDisplayer.svelte';

	const dispatch = createEventDispatcher();

	type ColumnValueProps = {
		id: number;
		name: string;
		today: number;
	};
	export let props: ColumnValueProps;

	let updateColumn = debounce(async (e) => {
		if (e.target.value === '') {
			props.today = 0;
			return;
		}

		if (isTooBig(e.target.value)) {
			e.target.value = props.today;
			return;
		}

		props.today = e.target.value;

		let res = await fetch('/api/updateRow', {
			method: 'POST',
			body: JSON.stringify({
				colId: props.id,
				newValue: props.today
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

    await targetDisplayer()
		dispatch('updatedColumn');
	}, 400);

	function isTooBig(value: string) {
		if (value.length >= 10) {
			return true;
		}
		return false;
	}

  let targetDisplayer: any

	let mousedOver = false;
	let editing = false;

	function isDropdownInViewport(dropdownMenu: HTMLDivElement) {
		if (!dropdownMenu) {
			return true;
		}
		const rect = dropdownMenu.getBoundingClientRect();
		const isInViewport =
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
		return isInViewport;
	}

	function isDropdownNearBottom(dropdown: HTMLDivElement) {
		if (!dropdown) {
			return true;
		}
		const rect = dropdown.getBoundingClientRect();
		const bottomThreshold = window.innerHeight - 20; // Adjust as needed
		const isNearBottom = rect.bottom > bottomThreshold;
		return isNearBottom;
	}

	let dropdown: HTMLDivElement;

	let dropdownEndClass = '';

	function setDropDownEndClass(dropdown: HTMLDivElement) {
		dropdownEndClass = '';
		if (!isDropdownInViewport(dropdown)) {
			dropdownEndClass = dropdownEndClass.concat(' dropdown-end');
		}

		if (isDropdownNearBottom(dropdown)) {
			dropdownEndClass = dropdownEndClass.concat(' dropdown-top');
		}
	}

	$: {
		setDropDownEndClass(dropdown);
	}

  let updateColumnDropdown: HTMLDetailsElement
  let refetchColumnStats 
</script>

<svelte:window on:resize={() => setDropDownEndClass(dropdown)} />

<div
	class="my-3"
	on:blur={() => (mousedOver = false)}
	on:focus={() => (mousedOver = true)}
	on:mouseover={() => (mousedOver = true)}
	on:mouseout={() => (mousedOver = false)}
	role="dialog"
>
	<div class="relative flex flex-row justify-center gap-3">
		<ColumnStatsOnHover name={props.name} colId={props.id} bind:refetchColumnStats/>
		<details class="dropdown {dropdownEndClass}" bind:this={updateColumnDropdown}>
			<summary class="btn btn-xs absolute {mousedOver ? '' : 'disabled opacity-0'}">
				<IconSettings stroke={1} size={20} />
			</summary>
			<div class="menu dropdown-content z-10 bg-base-200" bind:this={dropdown}>
				<UpdateColumnForm colId={props.id} on:close={() => updateColumnDropdown.removeAttribute('open')} on:refetchData={() => { refetchColumnStats(); dispatch('updatedColumn') }}
				></UpdateColumnForm>
			</div>
      <button class="fixed top-0 left-0 h-screen w-screen" on:click={() => updateColumnDropdown.removeAttribute("open")}></button>
		</details>
	</div>
	<input
		type="number"
		inputmode="numeric"
		on:input={updateColumn}
		placeholder="0"
		value={props.today}
		class="border-gray input rounded-lg border border-2 py-2 text-center font-bold caret-transparent shadow-lg outline-none focus:border-black focus:outline-none"
	/>
  <TargetDisplayer columnId={props.id} bind:refetch={targetDisplayer}/>
</div>

<style>
	input::placeholder {
		color: black;
	}

	input::-webkit-inner-spin-button,
	input::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
