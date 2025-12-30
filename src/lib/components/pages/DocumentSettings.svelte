<script lang="ts">
	import { Button, Label } from 'bits-ui';

	let { deleteFunc, renameDocument, back } = $props();

	let renameTo = $state('');

	async function deleteF() {
		if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
			await deleteFunc();
		}
	}

	async function rename(event: Event) {
		event.preventDefault();
		await renameDocument(renameTo);
	}
</script>

<h1 class="h1">Document Settings</h1>

<div class="m-auto w-fit text-center">
	<form onsubmit={rename} class="mb-10 block text-left">
		<div class="inline w-full text-left">
			<Label.Root for="rename" class="block">Rename Document:</Label.Root>
			<input type="text" class="w-40" id="rename" required bind:value={renameTo} />
		</div>
		<Button.Root type="submit">Go</Button.Root>
	</form>
	<Button.Root onclick={deleteF} class="red-button m-auto">Delete Document</Button.Root>
</div>

<button class="a m-auto mt-5 block" onclick={back}>Back</button>
