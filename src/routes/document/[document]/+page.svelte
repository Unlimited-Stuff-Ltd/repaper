<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { decode, type DocumentLink, type Character } from '$lib';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Loading, Viewer, Editor } from '$lib/components';
	import { page } from '$app/state';
	import { Slider } from '$lib/components';

	let { data }: PageProps = $props();

	let loading = $state(true);

	let document = $state<{ title: string; content: Character[] }>({
		title: '',
		content: []
	});

	let mode = $state('viewer');

	let scale = $state(100);

	let token = $state('');

	onMount(async () => {
		const modeLS = page.url.searchParams.get('mode');
		if (!modeLS) {
			goto(resolve('/recents'), { replaceState: true });
			return;
		}
		mode = modeLS;
		const documentCU = await data.promise;
		let recentDocuments: DocumentLink[] = JSON.parse(
			localStorage.getItem('repaper-recent-documents') ?? '[]'
		);
		let i = recentDocuments.findIndex((a) => a.code === data.document);
		const tokenV = localStorage.getItem('repaper-token');
		if (!tokenV) {
			goto(resolve('/recents'), { replaceState: true });
			return;
		}
		token = tokenV;
		const response = await fetch('/api/token', {
			method: 'POST',
			body: JSON.stringify({
				token,
				documentCode: data.document,
				mode
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

	async function save(content: string) {
		const response = await fetch('/api/save', {
			method: 'POST',
			body: JSON.stringify({
				content,
				code: data.document,
				token
			})
		});
		if (response.status === 401) {
			goto(resolve('/'), { replaceState: true });
		} else {
			return response.status;
		}
	}
</script>

<Loading show={loading} />

<div class="pt-20">
	<div class="m-auto w-fit">
		<p class="mt-7 mb-1 font-bold text-(--fg)/60">Zoom:</p>
		<div class="m-auto w-120">
			<Slider bind:value={scale} max={100} min={30} />
		</div>
	</div>
	{#if mode === 'viewer'}
		<Viewer {document} {scale} />
	{:else}
		<Editor {document} {scale} {save} />
	{/if}
</div>
