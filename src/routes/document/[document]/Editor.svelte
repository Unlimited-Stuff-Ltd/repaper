<script lang="ts">
	import { Loading, Popover } from '$lib/components';
	import TextEditor from './TextEditor.svelte';
	import { Button } from 'bits-ui';
	import lang, { languageState as lS } from '$lib/lang.svelte';
	import fullscreen from '$lib/fullscreen';

	let {
		document,
		scale = $bindable(),
		save,
		settings,
		show,
		autosave,
		changesMadeSinceSave = $bindable()
	} = $props();

	let loading = $state(false);

	let editor: any = $state();

	function onbeforeunload(event: Event) {
		if (changesMadeSinceSave) {
			event.preventDefault();
		}
	}

	export async function saveFunction() {
		await editor.saveFunc(true);
	}

	async function enableFullscreen() {
		fullscreen.set(true);
		scale = 100;
	}

	async function disableFullscreen() {
		fullscreen.set(false);
		scale = 70;
	}
</script>

<Loading show={loading} />

<svelte:window {onbeforeunload} />

<svelte:head>
	<title>{document.title} - Repaper</title>
</svelte:head>

<div class="w-fit" hidden={!show}>
	<div class="sticky {$fullscreen ? 'w-screen left-0' : 'left-70 w-[calc(100vw-17.5rem)]'}">
		<div class="relative top-0 mt-8 flex w-fit m-auto">
			<h2 class="m-auto text-center font-bold text-lg text-(--fg)/60">
				{lang(lS, 'Edit Mode', "Mode d'Éditeur")}
			</h2>
			<Button.Root onclick={settings} class="m-auto ml-5 h-fit"
				>{lang(lS, 'Document Settings', 'Paramètres du Document')}</Button.Root
			>
			<Popover questionMark={false} bClass="m-auto ml-5" message={lang(lS, 'Share', 'Partager')}>
				{lang(
					lS,
					'Share the document code and editor password for other editors.',
					"Partager le code du document et le mot de passe d'éditeur pour les autres éditeurs."
				)}<br />
				{#if document.passwordRequired}
					{lang(lS, '', '')}
				{:else}
					{lang(lS, `Share this link for viewers`, 'Partager ce lien pour les spectateurs')}:
					<span class="underline">https://repaper.unlimitedstuffltd.com/open/{document.code}</span>
				{/if}
			</Popover>
			{#if !$fullscreen}
				<Button.Root onclick={enableFullscreen} class="m-auto ml-5 h-fit"
					>{lang(lS, 'Fullscreen', 'Plein Écran')}</Button.Root
				>
			{:else}
				<Button.Root onclick={disableFullscreen} class="m-auto ml-5 h-fit"
					>{lang(lS, 'Exit Fullscreen', 'Sortir de Plein Écran')}</Button.Root
				>
			{/if}
			<Button.Root onclick={() => window.location.reload()} class="m-auto ml-5 h-fit"
				>{lang(lS, 'Reload', 'Rafraîchir')}</Button.Root
			>
		</div>
		<h1 class="h1 mb-0! mt-5">{document.title}</h1>
	</div>
	<TextEditor
		promise={document.promise}
		{save}
		initial={document.content}
		title={document.title}
		{autosave}
		scale="zoom: {scale / 100}; transform-origin: top center;"
		bind:this={editor}
	/>
	<div class="h-[2vw]"></div>
</div>
