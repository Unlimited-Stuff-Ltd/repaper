<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import English from './English.svelte';
	import French from './French.svelte';
</script>

<svelte:head>
	<title>{m.how_to()} {m.share_document()} - Repaper</title>
</svelte:head>

<div>
	<h3 class="text-center">
		<a class="underline underline-offset-2" href={resolve('/help')}>{m.help()}</a> → {m.share_document()}
	</h3>

	{#if getLocale() === 'en'}
		<English />
	{:else}
		<French />
	{/if}
</div>
