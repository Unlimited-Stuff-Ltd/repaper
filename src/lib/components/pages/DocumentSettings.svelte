<script lang="ts">
	import { Button } from 'bits-ui';

	let { deleteFunc } = $props();

	async function deleteF() {
		if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
			await deleteFunc();
		}
	}
</script>

<h1 class="h1">Document Settings</h1>

<Button.Root onclick={deleteF} class="red-button">Delete Document</Button.Root>
