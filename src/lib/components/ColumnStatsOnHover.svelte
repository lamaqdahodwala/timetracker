<script lang="ts">
	import { debounce } from 'lodash-es';
	import ColumnInfo from './ColumnInfo.svelte';
	import ColumnHistoricalGraph from './ColumnHistoricalGraph.svelte';
	import Graph from './Graph.svelte';
	export let name: string;
	export let colId: number;

	let textElement: HTMLElement;

	let isHovering = false;
	let updateHovering = debounce((e) => {
		isHovering = e;
	}, 200);
	function isDropdownInViewport(dropdownMenu: HTMLDivElement) {
		if (!dropdownMenu) {
			return true;
		}
		const rect = dropdownMenu.getBoundingClientRect();
		const isInViewport =
      ( rect.right + rect.width + 200) <= (window.innerWidth) &&
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

  export function refetchColumnStats() {
    refetchColumnInfo()
    refetchHistoricalGraph()
  }

  let refetchColumnInfo
  let refetchHistoricalGraph
</script>

<div class="dropdown dropdown-hover {dropdownEndClass}">
	<div
		class="underline decoration-dashed decoration-1 underline-offset-2 transition-all hover:text-gray-400"
		tabindex="0"
		role="button"
	>
		{name}
	</div>
	<div class="menu dropdown-content z-50 " bind:this={dropdown}>
		<div class="m-2 rounded-lg border border-gray-300 bg-gray-800 p-3 shadow-xl ">
			<ColumnInfo {colId} bind:refetch={refetchColumnInfo}/>
			<ColumnHistoricalGraph {colId} bind:refetch={refetchHistoricalGraph}/>
		</div>
	</div>
</div>
