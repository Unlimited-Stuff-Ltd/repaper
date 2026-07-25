<script lang="ts">
	import type { Pathname } from '$app/types';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { resolve } from '$app/paths';
	import { ModeWatcher } from 'mode-watcher';
	import { goto } from '$app/navigation';
	import { changed } from '$lib';
	import { ContextMenu } from '$lib/components';
	import { m } from '$lib/paraglide/messages';
	import fullscreen from '$lib/fullscreen';

	let { children } = $props();

	function oncontextmenu(event: Event) {
		event.preventDefault();
	}

	function go(where: any) {
		if ($changed) {
			if (confirm(m.confirm_leave())) {
				changed.set(false);
				goto(resolve(where));
			}
		} else {
			goto(resolve(where));
		}
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<svelte:window {oncontextmenu} />

<ModeWatcher
	lightClassNames={['light']}
	darkClassNames={['dark']}
	defaultTheme="default-georgia"
	defaultMode="light"
/>

{#snippet link(link: string, text: string)}
	<ContextMenu
		class="w-fit"
		actions={[
			{
				label: m.open_in_new_tab(),
				action: () => window.open(link, '_blank')
			}
		]}><button class="a" onclick={() => go(link)}>{text}</button></ContextMenu
	>
{/snippet}

<main class="h-screen w-screen text-center">
	<nav
		class="fixed z-40 flex h-screen w-70 flex-wrap border-r border-(--o) bg-(--bg) pt-9 text-left"
		class:hidden={$fullscreen}
	>
		<div class="w-full">
			<a href={resolve('/')}><h2 class="text-center text-4xl font-black">Repaper</h2></a>

			<div class="px-7 pt-4">
				{@render link('/create', m.create_document())}

				{@render link('/open', m.open_document())}

				{@render link('/recents', m.recent_documents())}

				{@render link('/settings', m.settings_title())}

				<div class="my-2 w-full border-b border-(--o)"></div>

				{@render link('/help', m.help())}

				{@render link('/articles', 'Articles')}
			</div>
		</div>

		<br />

		<div class="relative flex w-full flex-col justify-end pb-3 text-center">
			<div>
				<p class="text-[0.8rem]">repaper@unlimitedstuffltd.com</p>

				<a
					class="a text-center text-[0.8rem] underline underline-offset-2"
					href="https://github.com/the-okapi/repaper"
					target="_blank">https://github.com/the-okapi/repaper</a
				>
			</div>
		</div>
	</nav>

	<div class="{$fullscreen ? '' : 'ml-70'} inline-flex h-screen w-fit items-center justify-center">
		{@render children()}
	</div>
</main>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
