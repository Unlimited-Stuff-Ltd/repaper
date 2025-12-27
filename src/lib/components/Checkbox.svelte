<script lang="ts">
	import { Checkbox } from 'bits-ui';

	let { checked = $bindable(), ...props } = $props();
</script>

<Checkbox.Root
	bind:checked
	{...props}
	class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[5px] border border-(--o) bg-(--bg) font-bold"
>
	{#snippet children({ checked })}
		{#if checked}X{/if}
	{/snippet}
</Checkbox.Root>
