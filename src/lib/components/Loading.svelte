<script lang="ts">
	import Loader from '@lucide/svelte/icons/loader-circle';

	let { show, background = false } = $props();
</script>

{#if show}
	<div
		class="fixed inset-0 z-50 flex cursor-not-allowed items-center justify-center {background
			? 'bg-(--background)'
			: 'bg-black/70'}"
	>
		<Loader
			class="animate-spin text-{background ? '(--foreground)' : '(--background)'}"
			size={40}
		/>
	</div>
{/if}
