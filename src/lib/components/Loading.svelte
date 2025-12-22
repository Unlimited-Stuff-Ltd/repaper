<script lang="ts">
	import Loader from '@lucide/svelte/icons/loader-circle';

	let { show } = $props();
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex cursor-not-allowed items-center justify-center bg-black/70">
		<div class="rounded-[50%] border bg-(--background) p-2">
			<Loader class="animate-spin" size={40} />
		</div>
	</div>
{/if}
