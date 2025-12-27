<script>
	import { text } from '$lib/background';
	import { Recents } from '$lib/components';

	let length = $state(0);
</script>

<div class="fixed inset-0 left-70 z-40 flex items-center justify-center">
	<div>
		<h1 class="rounded-2xl p-5 text-8xl font-black">Repaper</h1>
		{#if length > 0}
			<div class="m-auto mt-5 h-fit w-fit rounded-xl border bg-(--background) p-4">
				<h2 class="mb-3 text-center text-lg font-bold">Recent Documents</h2>
				<Recents limit={3} bind:length />
			</div>
		{/if}
	</div>
</div>
<div class="block h-screen w-full overflow-hidden text-left opacity-50">
	<p class="w-full">{text}</p>
</div>
