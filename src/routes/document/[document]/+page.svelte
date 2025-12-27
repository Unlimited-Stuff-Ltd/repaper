<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { decode, type DocumentLink, type Character } from '$lib';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Loading, Viewer } from '$lib/components';
	import { page } from '$app/state';

	let { data }: PageProps = $props();

	let loading = $state(true);

	let document = $state<{ title: string; content: Character[] }>({
		title: '',
		content: []
	});

	onMount(async () => {
		// get editor or viewer
		const mode = page.url.searchParams.get('mode');
		// if not found, redirect
		if (!mode) {
			goto(resolve('/recents'), { replaceState: true });
			return;
		}
		// wait for document from db to load
		const documentCU = await data.promise;
		// get recent documents from localStorage
		let recentDocuments: DocumentLink[] = JSON.parse(
			localStorage.getItem('repaper-recent-documents') ?? '[]'
		);
		console.log(recentDocuments);
		// find current document in localStorage
		let i = recentDocuments.findIndex((a) => (a.code = data.document));
		// get token from ls
		const token = localStorage.getItem('repaper-token');
		// check if token is valid
		const response = await fetch('/api/token', {
			method: 'POST',
			body: JSON.stringify({
				token,
				documentCode: data.document
			})
		});
		if (!documentCU || response.status === 401) {
			// if not valid token, remove document from history and redirect
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
			localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
			goto(resolve('/recents'), { replaceState: true });
			return;
		}
		console.log(recentDocuments);
		const current = {
			title: document.title,
			code: data.document,
			link: `/document/${data.document}?mode=${mode}`,
			mode,
			token
		};
		recentDocuments.splice(0, 0, current);
		localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
	});
</script>

<Loading show={loading} />

<Viewer {document} />
