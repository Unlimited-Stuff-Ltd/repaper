<script lang="ts">
	import Loader from '@lucide/svelte/icons/loader-circle';

	let { show } = $props();
</script>

{#if show}
	<div
		class="fixed inset-0 z-50 flex cursor-not-allowed items-center justify-center bg-(--background)"
	>
		<Loader class="animate-spin text-(--primary)" size={40} />
	</div>
{/if}
