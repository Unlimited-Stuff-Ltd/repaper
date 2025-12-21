<script lang="ts">
	import { Checkbox } from 'bits-ui';

	let { ...props } = $props();
</script>

<Checkbox.Root
	{...props}
	class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[5px] border bg-(--background) font-bold"
>
	{#snippet children({ checked })}
		{#if checked}X{/if}
	{/snippet}
</Checkbox.Root>
