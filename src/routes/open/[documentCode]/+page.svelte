<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Loading } from '$lib/components';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import fullscreenState from '$lib/fullscreen';
	import { openDocument } from '$lib/actions.remote';

	onMount(async () => {
		const code = page.params.documentCode ?? '';
		const response = await openDocument({
			code,
			password: null
		});
		if (response.status === 401 || response.status === 500) {
			goto(resolve('/'), { replaceState: true });
		}
		localStorage.setItem('repaper-token', response.ls);
		let fullscreen = page.url.searchParams.getAll('fullscreen');
		if (fullscreen.length > 0) {
			fullscreenState.set(true);
		}
		goto(response.link);
	});
</script>

<svelte:head>
	<title>Repaper</title>
</svelte:head>

<Loading show={true} />
