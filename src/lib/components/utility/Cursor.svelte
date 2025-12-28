<script lang="ts">
	import { onMount } from 'svelte';

	let { blinking, hidden = false } = $props();

	let shown = $state(true);

	onMount(() => {
		const interval = setInterval(() => {
			if (blinking) {
				shown = !shown;
			} else {
				shown = true;
			}
		}, 500);

		return () => clearInterval(interval);
	});
</script>

<div class={shown && !hidden ? 'cursor' : 'hidden-cursor'}></div>
