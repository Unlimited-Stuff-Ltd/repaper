<script lang="ts">
	import { SelectC } from '$lib/components';
	import { Select } from 'bits-ui';
	import Check from '@lucide/svelte/icons/check';

	type Theme = {
		value: string;
		label: string;
	};

	let value = $state('light');

	let themes = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' }
	];

	const selectedLabel = $derived(themes.find((theme: Theme) => theme.value === value));
</script>

<div>
	<h1 class="h1">Settings</h1>
	<SelectC bind:value trigger={selectedLabel?.label}>
		{#each themes as theme, i (i + theme.value)}
			<Select.Item value={theme.value} label={theme.label}>
				{#snippet children({ selected })}
					<div class="flex">
						{#if selected}<Check size={20} class="my-auto mr-2" />{:else}<Check
								size={20}
								class="my-auto mr-2 opacity-0"
							/>{/if}
						{theme.label}
					</div>
				{/snippet}
			</Select.Item>
		{/each}
	</SelectC>
</div>
