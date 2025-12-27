<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Loading } from '$lib/components';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	onMount(async () => {
		const code = page.params.documentCode;
		const response = await fetch('/api/open', {
			method: 'POST',
			body: JSON.stringify({
				code
			})
		});
		if (response.status === 401 || response.status === 500) {
			goto(resolve('/'), { replaceState: true });
		}
		const json = await response.json();
		localStorage.setItem('repaper-token', json.ls);
		goto(resolve(json.link), { replaceState: true });
	});
</script>

<Loading show={true} />
