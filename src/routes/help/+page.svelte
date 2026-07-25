<script lang="ts">
	import { LinkButton } from '$lib/components';
	import { m } from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{m.repaper_help()}</title>
</svelte:head>

<div>
	<h1 class="h1">{m.repaper_help()}</h1>

	<div class="flex gap-5">
		<LinkButton href="/help/create">{m.create_document()}</LinkButton>
		<LinkButton href="/help/open">{m.open_document()}</LinkButton>
		<LinkButton href="/help/share">{m.share_document()}</LinkButton>
	</div>
</div>
