<script lang="ts">
	import TextEditor from './TextEditor.svelte';
	import { Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
	import fullscreen from '$lib/fullscreen';

	let { document, scale = $bindable() } = $props();

	function enableFullscreen() {
		fullscreen.set(true);
		scale = 100;
	}

	function disableFullscreen() {
		fullscreen.set(false);
		scale = 70;
	}
</script>

<svelte:head>
	<title>{document.title} - Repaper</title>
</svelte:head>

<div class="h-screen" style={$fullscreen ? '' : 'max-width: calc(100vw - 17.5rem)'}>
	<div class="m-auto mt-8 flex w-fit">
		<h2 class="m-auto text-center text-lg font-bold text-(--fg)/60">
			{m.view_mode()}
		</h2>
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
	<h1 class="h1 m-auto mt-5 w-fit">{document.title}</h1>
	<TextEditor
		promise={document.promise}
		initial={document.content}
		editor={false}
		title={document.title}
		autosave={false}
		scale="zoom: {scale / 100}; transform-origin: top center;"
	/>
	<div class="h-[2vw]"></div>
</div>
