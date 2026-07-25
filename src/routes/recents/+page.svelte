<script lang="ts">
	import { Recents } from '$lib/components';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{m.recent_documents()} - Repaper</title>
</svelte:head>

<div>
	<h1 class="h1">{m.recent_documents()}</h1>
	<Recents empty={true} />
	<p class="m-auto mt-6 w-fit text-center">
		{m.document_not_here()}
		<a href={resolve('/open')} class="text-center underline underline-offset-2">{m.here()}</a>.
	</p>
</div>
