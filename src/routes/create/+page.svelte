<script lang="ts">
	import { goto } from '$app/navigation';
	import { Label, Button, Input } from '$lib/components';
	import { createFile } from '$lib/pocketbase';

	const validCodeChars = 'abcdefghijklmnopqrstuvwxyz0123456789-';

	let loading = $state(false);

	let errorText = $state('');

	let name = $state('');
	let editCode = $state('');
	let editPassword = $state('');
	let editPasswordConfirm = $state('');
	let viewCode = $state('');
	let viewPassword = $state('');
	let viewPasswordConfirm = $state('');

	let firstPage = $state(true);

	function back() {
		firstPage = true;
	}

	async function firstPageSubmit(event: Event) {
		event.preventDefault();
		for (let i = 0; i < editCode.length; i++) {
			if (!validCodeChars.includes(editCode[i])) {
				errorText = 'File Code can only include lowercase letters, numbers and hyphens.';
				return;
			}
		}
		if (editPassword !== editPasswordConfirm) {
			errorText = 'File Password and Confirm File Password do not match.';
			return;
		}
		if (editPassword.length < 8) {
			errorText = 'File Password must be at least 8 characters long.';
			return;
		}
		errorText = '';
		firstPage = false;
	}

	async function secondPageSubmit(event: Event) {
		event.preventDefault();
		for (let i = 0; i < viewCode.length; i++) {
			if (!validCodeChars.includes(viewCode[i])) {
				errorText = 'File Code can only include lowercase letters, numbers and hyphens.';
				return;
			}
		}
		if (viewPassword !== viewPasswordConfirm) {
			errorText = 'File Password and Confirm File Password do not match.';
			return;
		}
		if (viewPassword.length < 8) {
			errorText = 'File Password must be at least 8 characters long.';
			return;
		}
		errorText = '';
		loading = true;
		const result = await createFile(name, editCode, editPassword, viewCode, viewPassword);
		if (result.success) {
			goto('/?reload');
		} else {
			loading = false;
			errorText = result.error;
		}
	}
	function home() {
		goto('/');
	}
</script>

<svelte:head>
	<title>Repaper</title>
</svelte:head>
{#if loading}
	<p class="mt-[12vh] text-center text-lg text-transparent">invisible</p>
{:else}
	<div class="mt-[9vh] text-center">
		<Button variant="link" onclick={home}>Home</Button>
	</div>
{/if}
<h1 class="neon text-center font-serif text-[3em] font-black select-none">Create New File</h1>
<p class="text-center font-bold text-red-500">
	<span class="text-transparent">m</span>{errorText}<span class="text-transparent">m</span>
</p>

{#if loading}
	<p class="text-center font-bold text-(--primary)">Loading...</p>
{:else}
	<div class="m-auto w-[40%]">
		{#if firstPage}
			<p class="text-center">The File Name is the title of the file. It can be changed later.</p>
			<p class="text-center">
				The Editor File Code and Password are used to edit and change the file.
			</p>
			<p class="text-center">The file code cannot be changed later, while the file password can.</p>
			<div class="m-auto mt-8 w-fit">
				<form onsubmit={firstPageSubmit}>
					<Label for="fileName">File Name:</Label>
					<Input
						id="fileName"
						type="text"
						bind:value={name}
						placeholder="Name"
						class="mt-2 mb-4 w-[24rem]"
						required
					/>
					<Label for="editorCode">Editor File Code & Password:</Label>
					<Input
						id="editorCode"
						type="text"
						bind:value={editCode}
						placeholder="Editor File Code"
						class="mt-2 w-[24rem]"
						required
					/>
					<Input
						type="password"
						bind:value={editPassword}
						class="my-2 w-[24rem]"
						placeholder="Editor File Password"
						required
					/>
					<div class="flex">
						<Input
							type="password"
							bind:value={editPasswordConfirm}
							placeholder="Confirm Editor File Password"
							required
						/>
						<Button type="submit" class="ml-2 w-14 text-[0.95rem]">Next</Button>
					</div>
				</form>
			</div>
		{:else}
			<p class="text-center">The Viewer File Code and Password are used to view the file.</p>
			<p class="text-center">The file code cannot be changed later, while the file password can.</p>
			<div class="m-auto mt-8 w-fit">
				<form onsubmit={secondPageSubmit}>
					<Label for="viewerCode">Viewer File Code & Password:</Label>
					<Input
						id="viewerCode"
						type="text"
						bind:value={viewCode}
						placeholder="Viewer File Code"
						class="mt-2 w-[24rem]"
						required
					/>
					<Input
						type="password"
						bind:value={viewPassword}
						class="my-2 w-[24rem]"
						placeholder="Viewer File Password"
						required
					/>
					<div class="flex">
						<Input
							type="password"
							bind:value={viewPasswordConfirm}
							placeholder="Confirm Viewer File Password"
							class="w-[19.5rem]"
							required
						/>
						<Button type="submit" class="ml-2 w-16 text-[0.85rem]">Create</Button>
					</div>
				</form>
			</div>
			<Button class="m-auto mt-3 block h-10" onclick={back}>Back</Button>
		{/if}
	</div>
{/if}
