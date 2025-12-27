<script lang="ts">
	import { Loading } from '$lib/components';
	import { onMount } from 'svelte';
	import type { DocumentLink } from '$lib';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	let { size = 'w-80 h-fit', limit = 10, empty = false, length = $bindable() } = $props();

	let loading = $state(true);

	let recents: DocumentLink[] = $state([]);

	onMount(() => {
		const recentDocuments = localStorage.getItem('repaper-recent-documents');
		if (recentDocuments) {
			recents = JSON.parse(recentDocuments);
		}
		length = recents.length;
		if (recents.length > limit) {
			recents = recents.slice(0, limit);
		}
		loading = false;
	});

	function click(index: number) {
		const document = recents[index];
		localStorage.setItem('repaper-token', document.token);
		goto(resolve(document.link));
	}
</script>

<Loading show={loading} />

<div class="m-auto w-fit">
	{#if recents.length < 1}
		{#if empty}
			<p class="text-center text-lg">
				<a class="a" href={resolve('/open')}>Open a document</a> to get started.
			</p>
		{/if}
	{:else}
		<div class={size}>
			{#each recents as document, i (i)}
				<button
					onclick={() => click(i)}
					class="m-auto w-full cursor-pointer p-3 hover:bg-(--foreground)/5 {i === 0
						? 'rounded-t-lg'
						: ''} {i === recents.length - 1 ? 'rounded-b-lg border' : ' border-x border-t'}"
					><span class="font-semibold">{document.title}</span> - {document.mode === 'viewer'
						? 'View'
						: 'Edit'}</button
				>
			{/each}
		</div>
	{/if}
</div>
