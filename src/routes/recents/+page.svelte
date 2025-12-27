<script lang="ts">
	import { Recents } from '$lib/components';
	import { resolve } from '$app/paths';
</script>

<div>
	<h1 class="h1">Recent Documents</h1>
	<Recents empty={true} />
	<p class="m-auto mt-6 w-120 text-center">
		If the document you're looking for is not here, try opening it <a
			href={resolve('/open')}
			class="text-center underline underline-offset-2">here</a
		>.
	</p>
</div>
