<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { resolve } from '$app/paths';

	let { children } = $props();

	let mode = $state('');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Repaper</title>
</svelte:head>

<main class="{mode} h-screen w-screen">
	<nav class="fixed h-screen w-70 border-r pt-9">
		<a href={resolve('/')}><h2 class="text-center text-3xl font-black">Repaper</h2></a>
		<div class="pt-4 pl-7">
			{#if mode === ''}
				<button class="a" onclick={() => (mode = 'dark')}>Dark Mode</button>
			{:else}
				<button class="a" onclick={() => (mode = '')}>Light Mode</button>
			{/if}
		</div>
	</nav>
	<div class="flex">
		<div class="w-70"></div>
		<div>{@render children()}</div>
	</div>
</main>
