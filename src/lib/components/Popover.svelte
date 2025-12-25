<script lang="ts">
	import { Popover } from 'bits-ui';

	let { children } = $props();
</script>

<Popover.Root>
	<Popover.Trigger
		tabindex={-1}
		class="m-auto h-6 w-6 cursor-pointer items-center justify-center rounded-[50%] align-baseline hover:bg-(--foreground)/10 data-[state=open]:bg-(--foreground)/10"
		>?</Popover.Trigger
	>
	<Popover.Portal>
		<Popover.Content
			class="w-fit rounded-md border border-(--outline) bg-(--background) px-5 py-3 text-center"
			sideOffset={5}
		>
			<p>{@render children()}</p>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
