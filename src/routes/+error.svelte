<script lang="ts">
	import { page } from '$app/state';
</script>

<main
	class="flex h-screen items-center justify-center text-center"
	style="width: calc(100vw - 17.5rem)"
>
	<div class="h-fit w-fit">
		<p class="rotate-90 text-[10rem] font-black">:(</p>
		<h2 class="h1 mt-10 text-2xl">{page.status}: {page.error?.message}</h2>
	</div>
</main>
