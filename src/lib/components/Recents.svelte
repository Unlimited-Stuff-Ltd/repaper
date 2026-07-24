<script lang="ts">
	import { Loading, ContextMenu } from '$lib/components';
	import { onMount } from 'svelte';
	import type { DocumentLink } from '$lib';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import lang, { languageState as lS } from '$lib/lang.svelte';

	let { size = 'w-80 h-fit', limit = 10, empty = false, length = $bindable() } = $props();

	let loading = $state(true);

	let recents: DocumentLink[] = $state([]);

	//$inspect(recents);

	onMount(() => {
		const recentDocuments = localStorage.getItem('repaper-recent-documents');
		if (recentDocuments) {
			recents = JSON.parse(recentDocuments);
		}
		if (recents.length > limit) {
			recents = recents.slice(0, limit);
		}
		length = recents.length;
		loading = false;
	});

	function click(index: number) {
		const document = recents[index];
		localStorage.setItem('repaper-token', document.token);
		goto(resolve(document.link));
	}

	async function remove(index: number) {
		fetch('/api/forget', {
			method: 'POST',
			body: JSON.stringify({
				token: recents[index].token
			})
		});
		recents.splice(index, 1);
		length = recents.length;
		localStorage.setItem('repaper-recent-documents', JSON.stringify(recents));
	}
</script>

<Loading show={loading} />

<div class="m-auto w-fit">
	{#if length >= 1}
		<div class={size}>
			{#each recents as document, i (i)}
				<ContextMenu
					actions={[
						{
							label: lang(lS, 'Forget this Document', 'Oublier ce Document'),
							action: () => remove(i)
						}
					]}
					class="flex"
				>
					<button
						onclick={() => click(i)}
						class="m-auto w-full cursor-pointer border-(--o) p-3 hover:bg-(--fg)/5 {i === 0
							? 'rounded-t-lg'
							: ''} {i === recents.length - 1 ? 'rounded-b-lg border' : ' border-x border-t'}"
						><span class="font-semibold">{document.title}</span> - {document.mode === 'viewer'
							? lang(lS, 'View', 'Spectateur')
							: lang(lS, 'Edit', 'Éditeur')}</button
					>
				</ContextMenu>
			{/each}
		</div>
	{:else}
		{#if empty}
			<p class="text-center text-lg">
				{lang(lS, 'Open a document to get started.', 'Ouvrir un document pour commencer.')}
			</p>
		{/if}
	{/if}
</div>
