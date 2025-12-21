<script lang="ts">
	import { Checkbox, Popover } from '$lib/components';
	import { Label, Button } from 'bits-ui';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	let account: string | null = $state(null);

	onMount(() => {
		const accountLS = localStorage.getItem('repaper-account');
		if (accountLS) {
			account = accountLS;
		}
	});
</script>

<div>
	<h1 class="mb-5 text-5xl font-black">Create a Document</h1>
	<form method="POST" class="text-center" use:enhance>
		<div class="m-auto mb-5 w-fit text-left">
			<Label.Root for="title"
				>Document Title:
				<Popover>This is the title of the document.<br />This can be changed later.</Popover>
			</Label.Root><br />
			<input id="title" class="mt-0.5 w-120" name="title" required />
		</div>
		<div class="m-auto mb-5 w-fit text-left">
			<Label.Root for="code"
				>Document Code:
				<Popover
					>This is the code to access the document.<br />This cannot be changed later.</Popover
				>
			</Label.Root><br />
			<input id="code" class="mt-0.5 w-120" name="code" required />
		</div>
		<div class="m-auto mb-3 inline-flex">
			<div class="text-left">
				<Label.Root for="editorPassword"
					>Editor Password:
					<Popover
						>This is the password used to edit the document.<br />This cannot be changed later.</Popover
					>
				</Label.Root><br />
				<input
					id="editorPassword"
					class="mt-0.5 mr-3 w-58"
					name="editorPassword"
					type="password"
					required
				/>
			</div>
			<div class="text-left">
				<Label.Root for="confirmEditorPassword">Confirm Editor Password:</Label.Root><br />
				<input
					id="confirmEditorPassword"
					name="confirmEditorPassword"
					class="mt-0.5 w-58"
					type="password"
					required
				/>
			</div>
		</div>
		<br />
		<div class="m-auto mb-5 inline-flex">
			<div class="text-left">
				<Label.Root for="viewerPassword"
					>Viewer Password:
					<Popover
						>This is the password used to view the document.<br />This cannot be changed later.</Popover
					>
				</Label.Root><br />
				<input id="viewerPassword" class="mt-0.5 mr-3 w-58" name="viewerPassword" type="password" />
			</div>
			<div class="text-left">
				<Label.Root for="confirmViewerPassword">Confirm Viewer Password:</Label.Root><br />
				<input
					id="confirmViewerPassword"
					name="confirmViewerPassword"
					class="mt-0.5 w-58"
					type="password"
				/>
			</div>
		</div>
		<br />
		{#if account}
			<div class="m-auto mb-7 flex w-fit">
				<input hidden name="account" value={account} />
				<Checkbox name="associateWithAccount" />
				<p class="ml-2">Associate with account</p>
			</div>
		{/if}
		<Button.Root type="submit">Create</Button.Root>
	</form>
</div>
