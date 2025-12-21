<script lang="ts">
	import { Checkbox } from 'bits-ui';
</script>

<Checkbox.Root
	class="flex h-6 w-6 items-center justify-center rounded-[5px] border bg-(--background) font-bold"
>
	{#snippet children({ checked })}
		{#if checked}X{/if}
	{/snippet}
</Checkbox.Root>
