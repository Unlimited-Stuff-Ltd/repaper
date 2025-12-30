<script lang="ts">
	import { Button } from 'bits-ui';

	let { deleteFunc, back } = $props();

	async function deleteF() {
		if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
			await deleteFunc();
		}
	}
</script>

<h1 class="h1">Document Settings</h1>

<div class="m-auto flex w-fit">
	<Button.Root onclick={deleteF} class="red-button">Delete Document</Button.Root>
</div>

<button class="a m-auto mt-5 block" onclick={back}>Back</button>
