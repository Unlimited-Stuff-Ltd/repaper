<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { Checkbox } from 'bits-ui';

	let { checked = $bindable(), ...props } = $props();
</script>

<Checkbox.Root bind:checked {...props}>
	{#snippet children({ checked })}
		{#if checked}
			<div class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[5px] bg-(--p)">
				<Check size={18} class="m-auto text-(--p-fg)" />
			</div>
		{:else}
			<div class="h-6 w-6 cursor-pointer rounded-[5px] border border-(--o) bg-(--bg)"></div>
		{/if}
	{/snippet}
</Checkbox.Root>
