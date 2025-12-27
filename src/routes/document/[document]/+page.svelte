<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { decode, type DocumentLink, type Character } from '$lib';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Loading, Viewer } from '$lib/components';

	let { data }: PageProps = $props();

	let loading = $state(true);

	let document = $state<{ title: string; content: Character[] }>({
		title: '',
		content: []
	});

	onMount(async () => {
		const documentCU = await data.promise;
		let recentDocuments: DocumentLink[] = JSON.parse(
			localStorage.getItem('repaper-recent-documents') ?? '[]'
		);
		let i = recentDocuments.findIndex((a) => (a.code = data.document));
		const token = localStorage.getItem('repaper-token');
		const response = await fetch('/api/token', {
			method: 'POST',
			body: JSON.stringify({
				token,
				documentCode: data.document
			})
		});
		if (!documentCU || response.status === 401) {
			if (i !== -1) {
				recentDocuments.splice(i, 1);
				localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
			}
			goto(resolve('/recents'), { replaceState: true });
			return;
		}
		document.title = documentCU.title;
		document.content = decode(documentCU.content);
		loading = false;
		if (i !== -1) {
			recentDocuments.splice(i, 1);
		}
		if (!token) {
			goto(resolve('/recents'), { replaceState: true });
			return;
		}
		const current = {
			title: document.title,
			code: data.document,
			link: `/document/${data.document}`,
			token
		};
		recentDocuments.splice(0, 0, current);
		localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
	});
</script>

<Loading show={loading} />

<Viewer {document} />
