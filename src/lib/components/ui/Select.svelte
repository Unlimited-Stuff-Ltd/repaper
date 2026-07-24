<script lang="ts">
	import { SelectC, SelectItem } from '$lib/components';
	import type { SelectItemType } from '$lib';

	let {
		options,
		value = $bindable(),
		onChange = () => {},
		styling = true,
		itemClass = '',
		...props
	} = $props();

	const selectedOptionLabel = $derived(
		options.find((option: SelectItemType) => option.value === value)
	);

	function onC(v: string) {
		value = v;
		onChange();
	}

	function getRoundedCorners(i: number) {
		if (i === 0 && options.length === 0) {
			return 'rounded-xl';
		} else if (i === 0) {
			return 'rounded-t-xl';
		} else if (i === options.length - 1) {
			return 'rounded-b-xl';
		}
	}
</script>

<SelectC bind:value onValueChange={onC} trigger={selectedOptionLabel?.label} {...props}>
	{#each options as option, i (i + option.value)}
		<SelectItem value={option} {styling} class={itemClass} rounded={getRoundedCorners(i)} />
	{/each}
</SelectC>
