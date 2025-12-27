<script lang="ts">
	import { Text } from '$lib/components';

	let { document, scale } = $props();
</script>

<div class="h-screen" style="width: calc(100vw - 17.5rem)">
	<h2 class="mt-8 text-center text-lg font-bold text-(--fg)/60">View</h2>
	<h1 class="h1">{document.title}</h1>
	<div class="page" style="transform: scale({scale / 100}); margin-top: -{(100 - scale) / 2.25}%">
		<pre class="content"><Text content={document.content} /></pre>
	</div>
	<div class="h-[2vw]"></div>
</div>
