<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { Select } from 'bits-ui';

	let { value } = $props();
</script>

<Select.Item value={value.value} label={value.label} class="hover:bg-(--foreground)/10">
	{#snippet children({ selected })}
		<div class="flex">
			{#if selected}<Check size={20} class="my-auto mr-2" />{:else}<Check
					size={20}
					class="my-auto mr-2 opacity-0"
				/>{/if}
			{@html value.label}
		</div>
	{/snippet}
</Select.Item>
