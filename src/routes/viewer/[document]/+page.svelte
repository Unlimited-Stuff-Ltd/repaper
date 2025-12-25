<script lang="ts">
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import { Loading } from '$lib/components';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();

	let loading = $state(true);

	let document = $state({
		title: '',
		content: ''
	});

	onMount(async () => {
		const documentCU = await data.promise;
		if (!documentCU) {
			goto(resolve('/open'), { replaceState: true });
			return;
		}
		document = documentCU;
		loading = false;
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

<Loading show={loading} background={true} />

<div>
	<h1 class="h1">{document.title}</h1>
	<p>{document.content}</p>
</div>
