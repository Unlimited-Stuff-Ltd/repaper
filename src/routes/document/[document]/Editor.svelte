<script lang="ts">
	import { Loading, Popover } from '$lib/components';
	import TextEditor from './TextEditor.svelte';
	import { Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
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
	<div class="sticky {$fullscreen ? 'left-0 w-screen' : 'left-70 w-[calc(100vw-17.5rem)]'}">
		<div class="relative top-0 m-auto mt-8 flex w-fit">
			<h2 class="m-auto text-center text-lg font-bold text-(--fg)/60">
				{m.edit_mode()}
			</h2>
			<Button.Root onclick={settings} class="m-auto ml-5 h-fit">{m.document_settings()}</Button.Root
			>
			<Popover questionMark={false} bClass="m-auto ml-5" message={m.share()}>
				{m.share_code_editor()}<br />
				{#if !document.passwordRequired}
					{m.share_viewers()}:
					<span class="underline">https://repaper.unlimitedstuffltd.com/open/{document.code}</span>
				{/if}
			</Popover>
			{#if !$fullscreen}
				<Button.Root onclick={enableFullscreen} class="m-auto ml-5 h-fit"
					>{m.fullscreen()}</Button.Root
				>
			{:else}
				<Button.Root onclick={disableFullscreen} class="m-auto ml-5 h-fit"
					>{m.exit()} {m.fullscreen()}</Button.Root
				>
			{/if}
			<Button.Root onclick={() => window.location.reload()} class="m-auto ml-5 h-fit"
				>{m.reload()}</Button.Root
			>
		</div>
		<h1 class="h1 mt-5 mb-0!">{document.title}</h1>
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
