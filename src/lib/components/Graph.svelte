<script lang="ts">
	import * as Plot from '@observablehq/plot';
	export let data: { date: string; value: number }[];
	export let graphClass;

	let chartDiv: HTMLElement;
	let containerDiv: HTMLElement;

	$: {
		chartDiv?.firstChild?.remove();
		if (!(data.length === 0)) {
      let newData = data.map((value) => ({
        date: new Date(value.date),
        value: value.value
      })) 
			chartDiv?.append(
				Plot.plot({
					width: containerDiv.getBoundingClientRect().width,
					height: containerDiv.getBoundingClientRect().height,
          x: {
            interval: "day"
          },
					marks: [
						Plot.lineY(newData, { x: 'date', y: 'value'}),
						Plot.tip(newData, Plot.pointerX({ x: 'date', y: 'value' }))
					]
				})
			);
		} else {
			chartDiv?.append(
				Plot.plot({
					width: containerDiv.getBoundingClientRect().width,
					height: containerDiv.getBoundingClientRect().height,
					marks: [
						Plot.frame(),
						Plot.text(['No data to show'], { frameAnchor: 'middle', fontSize: 16 })
					]
				})
			);
		}
	}
</script>

<div bind:this={containerDiv} class={graphClass}>
	<div bind:this={chartDiv}></div>
</div>
