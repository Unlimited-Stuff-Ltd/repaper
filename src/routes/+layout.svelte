<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Repaper</title>
</svelte:head>

<main class="h-screen w-screen">
	<nav class="fixed h-screen w-70 border-r pt-9">
		<a href={resolve('/')}><h2 class="text-center text-4xl font-black">Repaper</h2></a>
		<div class="pt-4 pl-7">
			<a class="a" href={resolve('/create')}>Create a Document</a><br />
		</div>
	</nav>
	<div class="flex">
		<div class="w-70"></div>
		<div class="flex h-screen items-center justify-center" style="width: calc(100vw - 17.5rem)">
			{@render children()}
		</div>
	</div>
</main>
