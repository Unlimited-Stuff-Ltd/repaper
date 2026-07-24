<script lang="ts">
	import { resolve } from '$app/paths';
	import lang, { languageState as lS } from '$lib/lang.svelte';
	import English from './English.svelte';
	import French from './French.svelte';
</script>

<svelte:head>
	<title
		>{lang(lS, 'How to Create a Document - Repaper', 'Comment Créer un Document - Repaper')}</title
	>
</svelte:head>

<div>
	<h3 class="text-center">
		<a class="underline underline-offset-2" href={resolve('/help')}>{lang(lS, 'Help', 'Aide')}</a> → {lang(
			lS,
			'Create a Document',
			'Créer un Document'
		)}
	</h3>

	{#if lS.lang === 'en'}
		<English />
	{:else}
		<French />
	{/if}
</div>
