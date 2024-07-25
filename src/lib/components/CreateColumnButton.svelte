<script lang="ts">
	import IconTablePlus from '@tabler/icons-svelte/IconTablePlus.svelte';
	import CreateColumnForm from './CreateColumnForm.svelte';
	import { fade, fly } from 'svelte/transition';
	import { createEventDispatcher, onMount } from 'svelte';

	let dispatch = createEventDispatcher();

	let formOpen = false;
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

	let dropdown: HTMLDetailsElement

	let dropdownEndClass = '';

	function setDropDownEndClass(dropdown: HTMLDetailsElement) {
		dropdownEndClass = '';
		if (!isDropdownInViewport(dropdown)) {
			dropdownEndClass = dropdownEndClass.concat(' dropdown-end');
		}

		if (isDropdownNearBottom(dropdown)) {
			dropdownEndClass = dropdownEndClass.concat(' dropdown-top');
		}
	}

  onMount(() => {
    setDropDownEndClass(dropdown)
  })
</script>


<svelte:window on:resize={() => {  setDropDownEndClass(dropdown) }}></svelte:window>

<details class="dropdown {dropdownEndClass}" bind:this={dropdown}>
	<summary tabindex="0" class="btn">
		<IconTablePlus />
	</summary>
	<div class="dropdown-content z-40 bg-base-200">
		<CreateColumnForm
			on:refetchData={() => {
				dispatch('refetchData');
				formOpen = false;
			}}
		></CreateColumnForm>
	</div>
  <button class="h-screen w-screen fixed top-0 left-0" on:click={() => dropdown.removeAttribute('open')}></button>
</details>
