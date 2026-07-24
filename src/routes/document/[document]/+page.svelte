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
	import lang, { languageState as lS } from '$lib/lang.svelte';
	import fullscreen from '$lib/fullscreen';

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
		const response = await fetch('/api/token', {
			method: 'POST',
			body: JSON.stringify({
				token,
				documentCode: page.params.document,
				mode
			})
		});
		if (!documentCU || response.status !== 200) {
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
		const response = await fetch('/api/save', {
			method: 'POST',
			body: JSON.stringify({
				content,
				code: page.params.document,
				token
			})
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

	async function deleteFunc() {
		loading = true;
		changesMadeSinceSave = false;
		await fetch('/api/delete', {
			method: 'POST',
			body: JSON.stringify({
				code: data.document,
				token
			})
		});
		let recentDocuments: DocumentLink[] = JSON.parse(
			localStorage.getItem('repaper-recent-documents') ?? '[]'
		);
		const newRecentDocuments = recentDocuments.filter((a) => a.code !== data.document);
		localStorage.setItem('repaper-recent-documents', JSON.stringify(newRecentDocuments));
		window.location.assign('/');
	}

	async function changePassword(oldPassword: string, newPassword: string, editorPassword: boolean) {
		loading = true;
		await editor.saveFunction();
		const response = await fetch('/api/change/password', {
			method: 'POST',
			body: JSON.stringify({
				code: data.document,
				token,
				oldPassword,
				newPassword,
				editor: editorPassword
			})
		});
		if (response.status === 401) {
			goto(resolve('/'), { replaceState: true });
		} else if (response.status === 400) {
			loading = false;
			return 1;
		} else if (response.status === 500) {
			alert(
				lang(
					lS,
					'Failed to change password. Please try again later',
					"Impossible de changer le mot de passe. Essayez plus tard s'il vous plaît."
				)
			);
		} else {
			window.location.reload();
		}
		showSettings = false;
		loading = false;
	}

	async function changeCode(to: string) {
		loading = true;
		await editor.saveFunction();
		const response = await fetch('/api/change/code', {
			method: 'POST',
			body: JSON.stringify({
				code: data.document,
				token,
				newCode: to
			})
		});
		if (response.status === 401) {
			goto(resolve('/'), { replaceState: true });
			return;
		} else if (response.status === 500) {
			alert(
				lang(
					lS,
					'Failed to change document code. Please try again later',
					"Impossible de changer le code du document. Essayez plus tard s'il vous plaît."
				)
			);
			return;
		} else {
			const recentDocuments = JSON.parse(localStorage.getItem('repaper-recent-documents') ?? '[]');
			const index = recentDocuments.findIndex((a: any) => a.code === data.document);
			recentDocuments.splice(index, 1);
			const document = recentDocuments[index];
			document.code = to;
			recentDocuments.splice(0, 0, document);
			localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
			window.location.assign(`/document/${to}?mode=editor`);
			return;
		}
	}

	async function changeAutosave(to: boolean) {
		loading = true;
		await editor.saveFunction();
		const response = await fetch('/api/change/autosave', {
			method: 'POST',
			body: JSON.stringify({
				code: data.document,
				token,
				autosave: to
			})
		});
		if (response.status === 401) {
			goto(resolve('/'), { replaceState: true });
			return;
		} else if (response.status === 500) {
			alert(
				lang(
					lS,
					'Failed to change autosave. Please try again later',
					"Impossible de changer l'enregistrement automatique. Essayez plus tard s'il vous plaît."
				)
			);
			return;
		} else {
			const recentDocuments = JSON.parse(localStorage.getItem('repaper-recent-documents') ?? '[]');
			const index = recentDocuments.findIndex((a: any) => a.code === data.document);
			recentDocuments.splice(index, 1);
			const document = recentDocuments[index];
			document.autosave = to;
			recentDocuments.splice(0, 0, document);
			localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
			window.location.reload();
			return;
		}
	}

	async function changePasswordRequired(to: boolean) {
		loading = true;
		await editor.saveFunction();
		const response = await fetch('/api/change/passwordrequired', {
			method: 'POST',
			body: JSON.stringify({
				code: data.document,
				token,
				passwordRequired: to
			})
		});
		if (response.status === 401) {
			goto(resolve('/'), { replaceState: true });
			return;
		} else if (response.status === 500) {
			alert(
				lang(
					lS,
					'Failed to change if password is required to view. Please try again later',
					"Impossible de changer si le mot de passe est requis pour spectater. Essayez plus tard s'il vous plaît."
				)
			);
			return;
		} else {
			const recentDocuments = JSON.parse(localStorage.getItem('repaper-recent-documents') ?? '[]');
			const index = recentDocuments.findIndex((a: any) => a.code === data.document);
			recentDocuments.splice(index, 1);
			const document = recentDocuments[index];
			document.passwordRequired = to;
			recentDocuments.splice(0, 0, document);
			localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
			window.location.reload();
			return;
		}
	}

	async function renameDocument(to: string) {
		loading = true;
		await editor.saveFunction();
		const response = await fetch('/api/change/title', {
			method: 'POST',
			body: JSON.stringify({
				code: data.document,
				token,
				title: to
			})
		});
		if (response.status === 401) {
			goto(resolve('/'), { replaceState: true });
			return;
		} else if (response.status === 500) {
			alert(
				lang(
					lS,
					'Failed to rename document. Please try again later',
					"Impossible de renommer le document. Essayez plus tard s'il vous plaît."
				)
			);
			return;
		} else {
			const recentDocuments = JSON.parse(localStorage.getItem('repaper-recent-documents') ?? '[]');
			const index = recentDocuments.findIndex((a: any) => a.code === data.document);
			recentDocuments.splice(index, 1);
			const document = recentDocuments[index];
			document.title = to;
			recentDocuments.splice(0, 0, document);
			localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
			window.location.reload();
			return;
		}
	}
</script>

<Loading show={loading} />

<div class="w-fit min-h-screen">
	{#if !showSettings}
		<div class="sticky {$fullscreen ? 'w-screen left-0' : 'left-70 w-[calc(100vw-17.5rem)]'}">
			<div class="text-left w-fit m-auto">
				<div class="w-full invisible">Invisible Text</div>
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
			<DocumentSettings
				{deleteFunc}
				{renameDocument}
				{changePassword}
				{changeCode}
				{changePasswordRequired}
				{changeAutosave}
				autosave={document.autosave}
				viewerPasswordRequired={document.passwordRequired}
				back={() => (showSettings = false)}
			/>
		{/if}
	{/if}
</div>
