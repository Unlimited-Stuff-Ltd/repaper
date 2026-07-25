<script>
	import { Recents, Background } from '$lib/components';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';

	let length = $state(0);

	onMount(() => {
		const recentDocuments = localStorage.getItem('repaper-recent-documents');
		if (recentDocuments) {
			length = JSON.parse(recentDocuments).length;
		} else {
			length = 0;
		}
	});
</script>

<svelte:head>
	<title>Repaper</title>
</svelte:head>

<div class="fixed inset-0 left-70 z-30 flex items-center justify-center">
	<div>
		<h1 class="rounded-2xl p-5 text-8xl font-black text-shadow-(color:--p) text-shadow-lg">
			Repaper
		</h1>
		{#if length > 0}
			<div class="m-auto mt-6.5 h-fit w-fit rounded-xl border border-(--fg)/30 bg-(--bg) p-4">
				<h2 class="mb-3 text-center text-lg font-bold">
					{m.recent_documents()}
				</h2>
				<Recents limit={4} bind:length />
			</div>
		{/if}
	</div>
</div>

<Background class="absolute top-0 left-0" />
