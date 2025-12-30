<script lang="ts">
	import { Toggle } from 'bits-ui';

	let { children, ...props } = $props();
</script>

<Toggle.Root
	class="cursor-pointer rounded-lg px-2 py-1 hover:bg-(--fg)/20 data-[state=on]:bg-(--fg)/20"
	{...props}>{@render children()}</Toggle.Root
>
