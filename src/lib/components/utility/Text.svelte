<script lang="ts">
	let { content, fontSize = 17 } = $props();
</script>

{#each content as char, i (i)}
	<span
		class="{char.bold ? 'font-bold' : ''} {char.italic ? 'italic' : ''} {char.underline
			? 'underline'
			: ''} text-[{char.fontSize * fontSize}px]">{char.value}</span
	>
{/each}
