<script lang="ts">
	import { Text } from '$lib/components';

	let { document } = $props();
</script>

<div class="h-screen" style="width: calc(100vw - 17.5rem)">
	<h1 class="h1 mt-8">{document.title}</h1>
	<div class="page">
		<p><Text content={document.content} /></p>
	</div>
	<div class="h-[2vw]"></div>
</div>
