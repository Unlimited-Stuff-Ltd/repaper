<script lang="ts">
	import { TextEditor } from '$lib/components';

	let { document, scale } = $props();
</script>

<div class="h-screen" style="width: calc(100vw - 17.5rem)">
	<h2 class="mt-8 text-center text-lg font-bold text-(--fg)/60">View Mode</h2>
	<h1 class="h1">{document.title}</h1>
	<TextEditor
		promise={document.promise}
		initial={document.content}
		editor={false}
		style="transform: scale({scale / 100}); margin-top: -{(100 - scale) / 2.25}%"
	/>
	<div class="h-[2vw]"></div>
</div>
