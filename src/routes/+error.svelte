<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components';
	import { goto } from '$app/navigation';
</script>

<div class="mt-9 text-center">
	<Button variant="link" class="m-auto text-primary" onclick={() => goto('/')}>Home</Button>
</div>

<h1 class="text-center text-5xl">
	<span class="font-bold text-primary">Error {page.status}</span>: {page.error?.message}
</h1>
<h1 class="m-auto w-fit rotate-14 text-center text-[20rem] font-bold text-primary">!</h1>
