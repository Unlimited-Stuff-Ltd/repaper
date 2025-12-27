<script lang="ts">
	import { goto } from '$app/navigation';
	import { Checkbox, Popover, Loading, I } from '$lib/components';
	import { Label, Button } from 'bits-ui';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let account: string | null = $state(null);
	let loading = $state(false);

	let codeText = $state('');
	let editorPText = $state('');
	let viewerPText = $state('');

	let title = $state('');
	let code = $state('');
	let editorPassword = $state('');
	let confirmEditorPassword = $state('');
	let viewerPassword = $state('');
	let confirmViewerPassword = $state('');

	let publicDocument = $state(false);
	let associateAccount = $state(false);

	onMount(() => {
		const accountLS = localStorage.getItem('repaper-account');
		if (accountLS) {
			account = accountLS;
		}
	});

	const codeCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789-';

	function checkCode(code: string): boolean {
		for (let i = 0; i < code.length; i++) {
			if (!codeCharacters.includes(code[i])) {
				return false;
			}
		}
		return true;
	}

	function check() {
		let errors = 0;
		if (!checkCode(code)) {
			codeText = 'Code can only contain numbers, lowercase letters and hyphens.';
			errors++;
		} else {
			codeText = '';
		}
		if (editorPassword === viewerPassword) {
			viewerPText = 'Editor Password and Viewer Password cannot match.';
			errors++;
		} else if (viewerPassword === confirmViewerPassword) {
			viewerPText = '';
		}
		if (editorPassword !== confirmEditorPassword) {
			editorPText = 'Editor Password and Confirm Editor Password do not match.';
			errors++;
		} else {
			editorPText = '';
		}
		if (viewerPassword !== confirmViewerPassword) {
			viewerPText = 'Viewer Password and Confirm Viewer Password do not match.';
			errors++;
		}
		return errors;
	}

	async function onsubmit(event: Event) {
		event.preventDefault();
		loading = true;
		let errors = check();
		if (errors > 0) {
			loading = false;
			return;
		}
		const createResponse = await fetch('/api/create', {
			method: 'POST',
			body: JSON.stringify({
				title,
				code,
				editorPassword,
				viewerPassword
			})
		});
		if (createResponse.status === 409) {
			codeText = 'Document code is already taken.';
			loading = false;
			return;
		}
		const openResponse = await fetch('/api/open', {
			method: 'POST',
			body: JSON.stringify({
				code,
				password: editorPassword
			})
		});
		if (openResponse.status === 401 || openResponse.status === 500) {
			codeText = 'Something unexpected happened on our end. Please try again later.';
			loading = false;
			return;
		}
		const openJson = await openResponse.json();
		localStorage.setItem('repaper-token', openJson.ls);
		goto(resolve(openJson.link), { replaceState: true });
	}
</script>

<Loading show={loading} />

<div>
	<h1 class="h1">Create a Document</h1>
	<form {onsubmit}>
		<div class="m-auto mb-5 w-fit text-left">
			<Label.Root for="title"
				>Document Title:
				<Popover
					>This is the title of the document.<br />This <strong>can</strong> be changed later.</Popover
				>
			</Label.Root><br />
			<input
				id="title"
				autocomplete="off"
				class="mt-0.5 w-120"
				bind:value={title}
				maxlength="50"
				required
			/>
		</div>
		<div class="m-auto mb-0.5 w-fit text-left">
			<Label.Root for="code"
				>Document Code:
				<Popover
					>This is the code to access the document.<br />This <strong>cannot</strong> be changed later.</Popover
				>
			</Label.Root><br />
			<input
				id="code"
				autocomplete="off"
				class="mt-0.5 w-120"
				bind:value={code}
				maxlength="50"
				required
			/>
			<p class="text-sm text-(--red)"><I />{codeText}</p>
		</div>
		<div class="m-auto mb-0.5 inline-flex">
			<div class="text-left">
				<Label.Root for="editorPassword"
					>Editor Password:
					<Popover
						>This is the password used to edit the document.<br />This <strong>cannot</strong> be changed
						later.</Popover
					>
				</Label.Root><br />
				<input
					id="editorPassword"
					class="mt-0.5 mr-3 w-58"
					bind:value={editorPassword}
					type="password"
					autocomplete="off"
					required
				/>
			</div>
			<div class="text-left">
				<Label.Root for="confirmEditorPassword">Confirm Editor Password:</Label.Root><br />
				<input
					id="confirmEditorPassword"
					bind:value={confirmEditorPassword}
					class="mt-0.5 w-58"
					type="password"
					autocomplete="off"
					required
				/>
			</div>
		</div>
		<p class="text-left text-sm text-(--red)"><I />{editorPText}</p>
		<div class="m-auto mb-0.5 inline-flex">
			<div class="text-left">
				<Label.Root for="viewerPassword"
					>Viewer Password:
					<Popover
						>This is the password used to view the document.<br />This <strong>cannot</strong> be changed
						later.</Popover
					>
				</Label.Root><br />
				<input
					id="viewerPassword"
					autocomplete="off"
					class="mt-0.5 mr-3 w-58"
					bind:value={viewerPassword}
					type="password"
					required
				/>
			</div>
			<div class="text-left">
				<Label.Root for="confirmViewerPassword">Confirm Viewer Password:</Label.Root><br />
				<input
					id="confirmViewerPassword"
					autocomplete="off"
					bind:value={confirmViewerPassword}
					class="mt-0.5 w-58"
					type="password"
					required
				/>
			</div>
		</div>
		<p class="text-left text-sm text-(--red)"><I />{viewerPText}</p>
		<div class="m-auto mb-7 flex w-fit">
			<Checkbox bind:checked={publicDocument} id="publicDocument" />
			<Label.Root class="ml-2" for="publicDocument">
				Public Document
				<Popover>
					Public Documents can be <strong>viewed</strong> with only the file code.<br />
					This <strong>cannot</strong> be changed later.
				</Popover>
			</Label.Root>
		</div>
		{#if account}
			<div class="m-auto mb-7 flex w-fit">
				<Checkbox bind:checked={associateAccount} id="associateAccount" />
				<Label.Root class="ml-2" for="associateAccount">Associate with account</Label.Root>
			</div>
		{/if}
		<Button.Root type="submit">Create</Button.Root>
	</form>
</div>
