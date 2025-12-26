<script lang="ts">
	import { Loading } from '$lib/components';
	import { onMount } from 'svelte';
	import type { DocumentLink } from '$lib';
	import { resolve } from '$app/paths';

	let loading = $state(true);

	let recents: DocumentLink[] = $state([]);

	onMount(() => {
		const recentDocuments = localStorage.getItem('repaper-recent-documents');
		if (recentDocuments) {
			recents = JSON.parse(recentDocuments);
		}
		loading = false;
	});
</script>

<Loading show={loading} />

<div>
	{#if recents.length === 0}
		<p class="text-lg"><a class='a' href={resolve('/open')}>Open a document</a> to get started</p>
	{:else}
		{#each recents as document (document.code)}
			<p>{document.title}</p>
		{/each}
	{/if}
</div>
