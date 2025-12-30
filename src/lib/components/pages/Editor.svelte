<script lang="ts">
	import { Loading, TipTap } from '$lib/components';
	import { Button } from 'bits-ui';

	let { document, scale, save, settings } = $props();

	let loading = $state(false);

	let changesMadeSinceSave = $state(false);

	function onbeforeunload(event: Event) {
		if (changesMadeSinceSave) {
			event.preventDefault();
		}
	}
</script>

<Loading show={loading} />

<svelte:window {onbeforeunload} />

<div class="h-screen" style="width: calc(100vw - 17.5rem)">
	<div class="m-auto mt-8 flex w-fit">
		<h2 class="m-auto text-center text-lg font-bold text-(--fg)/60">Edit Mode</h2>
		<Button.Root onclick={settings} class="m-auto ml-5 h-fit">Document Settings</Button.Root>
	</div>
	<h1 class="h1">{document.title}</h1>
	<TipTap
		promise={document.promise}
		{save}
		initial={document.content}
		style="transform: scale({scale / 100}); margin-top: -{(100 - scale) / 2.25}%"
	/>
	<div class="h-[2vw]"></div>
</div>
