<script lang="ts">
	let { document } = $props();
</script>

<div class="h-screen" style="width: calc(100vw - 17.5rem)">
	<h1 class="h1 mt-8">{document.title}</h1>
	<div class="mx-auto rounded-[2vw] border border-(--outline) p-[2vw]" style="height: 11in; width: 8.5in;">
		<p>
			{#each document.content as char, i (i)}
				<span
					class="{char.bold ? 'font-bold' : ''} {char.italic ? 'italic' : ''} {char.underline
						? 'underline'
						: ''} text-[{char.fontSize * 0.8}rem]">{char.value}</span
				>
			{/each}
		</p>
	</div>
	<div class="h-[2vw]"></div>
</div>
