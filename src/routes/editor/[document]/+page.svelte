<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	onMount(() => {
		let recentDocuments: string[] = JSON.parse(
			localStorage.getItem('repaper-recent-documents') ?? '[]'
		);
		if (recentDocuments.includes(data.document)) {
			recentDocuments.splice(recentDocuments.indexOf(data.document), 1);
		}
		recentDocuments.splice(0, 0, data.document);
		localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
	});
</script>

<p>{data.document}</p>
