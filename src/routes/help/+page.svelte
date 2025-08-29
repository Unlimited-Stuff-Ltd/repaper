<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components';
</script>

<div class="text-center">
	<Button variant="link" onclick={() => goto('/?reload')} class="mt-9">Back</Button>
	<h1 class="font-serif text-6xl text-primary">Help</h1>
</div>
