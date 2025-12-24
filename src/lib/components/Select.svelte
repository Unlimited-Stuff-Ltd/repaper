<script lang="ts">
	import { Select } from 'bits-ui';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { getTextOfJSDocComment } from 'typescript';

	let { value = $bindable(), themes, ...props } = $props();

	const selectedLabel = $derived(themes.find((theme: any) => theme.value === value));
</script>

<Select.Root bind:value {...props} type="single">
	<Select.Trigger
		><div class="text-left">{selectedLabel.label}</div>
		<div class="text-right"><ChevronsUpDown size="20" class="m-auto ml-2" /></div></Select.Trigger
	>
    <Select.Portal>
        <Select.Content sideOffset={5}>
            <Select.ScrollUpButton><ChevronUp /></Select.ScrollUpButton>
            <Select.Viewport>
                {#each themes as theme, i (i + theme.value)}
                    <Select.Item class="bg-red-500" value={theme.value} label={theme.label}>
                        {#snippet children({ selected })}
                            <span class={selected ? "font-bold" : ""}>{theme.label}</span>
                        {/snippet}
                    </Select.Item>
                {/each}
            </Select.Viewport>
            <Select.ScrollDownButton><ChevronDown /></Select.ScrollDownButton>
        </Select.Content>
    </Select.Portal>
</Select.Root>
