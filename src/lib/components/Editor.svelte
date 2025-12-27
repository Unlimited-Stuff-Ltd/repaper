<script lang="ts">
	import { Text } from '$lib/components';

	let { document } = $props();
</script>

<div class="h-screen" style="width: calc(100vw - 17.5rem)">
	<h2 class="mt-8 text-center text-lg text-(--fg)/60">Edit</h2>
	<h1 class="h1">{document.title}</h1>
	<div class="page">
		<p><Text content={document.content} /></p>
	</div>
	<div class="h-[2vw]"></div>
</div>
