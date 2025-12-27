<script lang="ts">
	import { Popover } from 'bits-ui';

	let { children, ...props } = $props();
</script>

<Popover.Root>
	<Popover.Trigger
		tabindex={-1}
		{...props}
		class="m-auto h-6 w-6 cursor-pointer items-center justify-center rounded-[50%] align-baseline hover:bg-(--fg)/10 disabled:cursor-not-allowed disabled:hover:bg-transparent data-[state=open]:bg-(--fg)/10"
		>?</Popover.Trigger
	>
	<Popover.Portal>
		<Popover.Content
			class="w-fit rounded-md border border-(--o) bg-(--bg) px-5 py-3 text-center"
			sideOffset={5}
			tabindex={-1}
		>
			<p>{@render children()}</p>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
