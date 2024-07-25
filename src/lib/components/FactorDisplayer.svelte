<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let colType: string;
	export let factor;


  let dispatch = createEventDispatcher()
  function getPrefix(colType: string){

	  let prefix: string = '';

		switch (colType) {
			case 'additive':
				prefix = '+';
				break;
			case 'subtractive':
				prefix = '-';
				break;
			case 'multiplicative':
				prefix = 'x';
				break;
			case 'divisive':
				prefix = '/';
				break;
		}

    return prefix
  }

  function isMultiplicative(colType: string){
    if (['multiplicative', 'divisive'].includes(colType)){
      return true
    }

    return false
  }

  function adaptFactorForColType(factor: number, colType: string){
    return isMultiplicative(colType) ? factor + 1 : factor
  }


	function generateFactorString(colType: string, factor: number) {
    let prefix = getPrefix(colType)
    let adaptedFactor = adaptFactorForColType(factor, colType)

    return prefix.concat(adaptedFactor.toString())
	}

  $: displayedFactor = generateFactorString(colType, factor)

  function updateFactorThroughInput(event: any){
    let newFactor: number

    if (event.target.value === "") newFactor = 0
    else newFactor = Number(event.target.value)

    if (newFactor < 0) newFactor = 0
    if (newFactor > 100) newFactor = 100



    if (isMultiplicative(colType)){
      newFactor = newFactor - 1
    }

    dispatch("updateFactor", {
      newFactor: newFactor
    })

    displayedFactor = generateFactorString(colType, newFactor)
  }
</script>

<div class="join">
  <div class="mx-2">{getPrefix(colType)}</div>
  <input class="font-bold" type="number" value={adaptFactorForColType(factor, colType)} on:input={(e) => updateFactorThroughInput(e)}/>
</div>

