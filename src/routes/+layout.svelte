<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { resolve } from '$app/paths';
	import { ModeWatcher } from 'mode-watcher';
	import { goto } from '$app/navigation';
	import { changed } from '$lib';

	let { children } = $props();

	function oncontextmenu(event: Event) {
		event.preventDefault();
	}

	function go(where: any) {
		if ($changed) {
			if (confirm('Are you sure you want to leave this page? Changes may not be saved.')) {
				changed.set(false);
				goto(resolve(where));
			}
		} else {
			goto(resolve(where));
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Repaper</title>
</svelte:head>

<svelte:window {oncontextmenu} />

<ModeWatcher
	lightClassNames={['light']}
	darkClassNames={['dark']}
	defaultTheme="default-georgia"
	defaultMode="light"
/>

<main class="h-screen w-screen">
	<nav class="fixed z-40 h-screen w-70 border-r border-(--o) bg-(--bg) pt-9">
		<a href={resolve('/')}><h2 class="text-center text-4xl font-black">Repaper</h2></a>
		<div class="pt-4 pl-7">
			<button class="a" onclick={() => go('/create')}>Create a Document</button><br />
			<button class="a" onclick={() => go('/open')}>Open a Document</button><br />
			<button class="a" onclick={() => go('/recents')}>Recent Documents</button><br />
			<button class="a" onclick={() => go('/settings')}>Settings</button><br />
		</div>
	</nav>
	<div class="flex">
		<div class="w-70"></div>
		<div class="flex h-screen items-center justify-center" style="width: calc(100vw - 17.5rem)">
			{@render children()}
		</div>
	</div>
</main>
