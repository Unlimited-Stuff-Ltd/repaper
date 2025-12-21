<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { Button } from 'bits-ui';

	let { children } = $props();

	let mode = $state('');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Repaper</title>
</svelte:head>

<main class="{mode} h-screen w-screen">
	<nav class="fixed w-70 border-r h-screen pt-9">
		<a href="/"><h2 class="text-center font-black text-3xl">Repaper</h2></a>
		<div class="pl-7 pt-4">
			{#if mode === ''}
				<button class="a" onclick={() => mode = 'dark'}>Dark Mode</button>
			{:else}
				<button class="a" onclick={() => mode = ''}>Light Mode</button>
			{/if}
		</div>
	</nav>
	<div class="flex">
		<div class="w-70"></div>
		<div>{@render children()}</div>
	</div>
</main>
