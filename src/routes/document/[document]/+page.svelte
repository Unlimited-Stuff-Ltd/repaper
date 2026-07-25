<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import type { DocumentLink } from '$lib';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Loading } from '$lib/components';
	import Viewer from './Viewer.svelte';
	import Editor from './Editor.svelte';
	import DocumentSettings from './DocumentSettings.svelte';
	import { page } from '$app/state';
	import { Slider } from '$lib/components';
	import fullscreen from '$lib/fullscreen';
	import { checkToken, saveDocument } from './actions.remote';

	let resolveP: (value: boolean) => void;

	let promise: Promise<boolean> = new Promise((resolve) => {
		resolveP = resolve;
	});

	let { data }: PageProps = $props();

	let loading = $state(true);

	let document = $state<{
		title: string;
		content: string;
		passwordRequired: boolean;
		autosave: boolean;
		promise: Promise<boolean>;
	}>({
		title: '',
		content: '',
		passwordRequired: false,
		autosave: true,
		promise
	});

	let mode = $state('viewer');

	let scale = $state(70);

	let token = $state('');

	let showSettings = $state(false);

	let editor: any = $state();

	onMount(async () => {
		if ($fullscreen) {
			scale = 100;
		}
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
		const tokenCheck = await checkToken({
			token,
			documentCode: page.params.document ?? '',
			permissions: mode
		});
		if (!documentCU || !tokenCheck) {
			if (i !== -1) {
				recentDocuments.splice(i, 1);
				localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
			}
			goto(resolve('/recents'), { replaceState: true });
			return;
		}
		document.title = documentCU.title ?? '';
		document.content = documentCU.content;
		document.passwordRequired = documentCU.passwordRequired;
		document.autosave = documentCU.autosave;
		resolveP(true);
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
		const response = await saveDocument({
			content,
			code: page.params.document ?? '',
			token
		});
		if (response.status === 401) {
			goto(resolve('/'), { replaceState: true });
		} else {
			return response.status;
		}
	}

	function settings() {
		showSettings = true;
	}

	let changesMadeSinceSave = $state(false);
</script>

<Loading show={loading} />

<div class="min-h-screen w-fit">
	{#if !showSettings}
		<div class="sticky {$fullscreen ? 'left-0 w-screen' : 'left-70 w-[calc(100vw-17.5rem)]'}">
			<div class="m-auto w-fit text-left">
				<div class="invisible w-full">Invisible Text</div>
				<p class="mb-1 font-bold text-(--fg)/60">Zoom:</p>
				<div class="m-auto w-120">
					<Slider bind:value={scale} max={150} min={30} />
				</div>
			</div>
		</div>
	{/if}
	{#if mode === 'viewer'}
		<Viewer {document} bind:scale />
	{:else}
		<Editor
			{document}
			bind:scale
			{save}
			{settings}
			autosave={document.autosave}
			show={!showSettings}
			bind:changesMadeSinceSave
			bind:this={editor}
		/>
		{#if showSettings}
			<!--
			<DocumentSettings
				autosave={document.autosave}
				viewerPasswordRequired={document.passwordRequired}
				back={() => (showSettings = false)}
			/>-->
			<DocumentSettings back={() => (showSettings = false)} />
		{/if}
	{/if}
</div>
