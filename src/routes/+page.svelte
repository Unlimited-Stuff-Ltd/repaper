<script lang="ts">
	import { goto } from '$app/navigation';
	import { Input, Label, Button } from '$lib/components';
	import { getFile, pb } from '$lib/pocketbase';
	import type { Result } from '$lib/pocketbase';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let fileCode = $state('');
	let filePassword = $state('');

	let errorText = $state('');

	let loading = $state(false);

	async function signIn(lcfc: string, auth: boolean) {
		errorText = '';
		loading = true;
		if (auth) localStorage.clear();
		let result: Result = await getFile(lcfc, filePassword, auth);
		if (result.success) {
			localStorage.setItem(lcfc, result.value);
			localStorage.setItem(`${lcfc}Name`, result.name);
			localStorage.setItem(`${lcfc}File`, result.file);
			goto(`/file/${lcfc}`);
		} else {
			loading = false;
			if (result.value === 'Failed to authenticate.') {
				errorText = 'Invalid file code or password.';
			} else {
				errorText = 'Error: ' + result.value;
			}
		}
	}

	async function onsubmit(event: Event) {
		event.preventDefault();
		// lcfc stands for lower case file name
		const lcfc = fileCode.toLowerCase();
		signIn(lcfc, true);
	}

	function createFile() {
		goto('/create');
	}

	onMount(() => {
		if (page.url.searchParams.getAll('invalid').length === 1) {
			errorText = 'File not found.';
			goto('/', { replaceState: true });
		} else if (page.url.searchParams.getAll('deleted').length === 1) {
			errorText = 'File deleted successfully.';
			goto('/', { replaceState: true });
		} else if (page.url.searchParams.getAll('reload').length === 1 && pb.authStore.isValid) {
			signIn(pb.authStore.record?.username, false);
			goto('/', { replaceState: true });
		} else {
			const error = page.url.searchParams.getAll('error');
			if (error.length > 0) {
				errorText = 'Error: ' + error[0];
			}
			goto('/', { replaceState: true });
		}
	});
</script>

<svelte:head>
	<title>Repaper</title>
</svelte:head>

<h1 class="neon mt-[18vh] h-[14vh] text-center font-serif text-[4.5em] font-black select-none">
	Repaper
</h1>
<p class="text-center font-bold text-red-500">
	<span class="text-transparent">m</span>{errorText}<span class="text-transparent">m</span>
</p>
{#if loading}
	<p class="text-center font-bold text-(--primary)">Loading...</p>
{:else}
	<div class="text-center">
		{#if !loading}
			<div class="mt-[11vh]">
				<form {onsubmit} class="m-auto block w-fit align-middle">
					<Label for="fileCode">Existing File Code & Password:</Label>
					<Input
						required
						id="fileCode"
						bind:value={fileCode}
						type="text"
						class="my-2 w-[24rem]"
						placeholder="File Code"
					/>
					<div class="mt-1.5 flex">
						<Input required bind:value={filePassword} type="password" placeholder="File Password" />
						<Button class="ml-2 w-14" type="submit">Go</Button>
					</div>
				</form>
			</div>
			<hr class="m-auto my-[5vh] w-[50vw]" />
			<Button onclick={createFile}>Create New File</Button>
		{/if}
	</div>
{/if}
