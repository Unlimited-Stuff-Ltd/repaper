<script lang="ts">
    let { document } = $props();
</script>

<div class="h-screen" style="width: calc(100vw - 17.5rem)">
	<h1 class="h1 mt-8">{document.title}</h1>
	<div class="mx-auto h-[59vw] w-[46.5vw] rounded-[2vw] border border-(--outline) p-[2vw]">
		<p>
			{#each document.content as char, i (i)}
				<span
					class="{char.bold ? 'font-bold' : ''} {char.italic ? 'italic' : ''} {char.underline
						? 'underline'
						: ''} text-[{char.fontSize}rem]">{char.value}</span
				>
			{/each}
		</p>
	</div>
	<div class="h-[2vw]"></div>
</div>