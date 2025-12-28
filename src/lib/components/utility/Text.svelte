<script lang="ts">
	let { content } = $props();
</script>

{#each content as char, i (i)}
	<span
		class="{char.bold ? 'font-bold ' : ''}{char.italic ? 'italic ' : ''}{char.underline
			? 'underline '
			: ''}text-[17px]">{char.value}</span
	>
{/each}
