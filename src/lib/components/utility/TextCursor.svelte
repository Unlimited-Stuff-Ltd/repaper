<script lang="ts">
	import { Cursor } from '$lib/components';

	let { content, cursor = false, blinking = false, cursorPos = 0 } = $props();
</script>

{#if content.length - cursorPos === 0}
	<Cursor {blinking} />
{/if}
{#each content as char, i (i)}
	<span
		class="relative text-transparent {char.bold ? 'font-bold ' : ''}{char.italic
			? 'italic '
			: ''}{char.underline ? 'underline ' : ''}text-[17px]">{char.value}</span
	>
	{#if content.length - (cursorPos + 1) === i && cursor}
		<Cursor {blinking} />
	{/if}
{/each}
