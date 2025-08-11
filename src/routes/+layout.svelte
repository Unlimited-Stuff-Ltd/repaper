<script lang="ts">
	import '../app.css';
	let { children } = $props();

	function preventDefault(event: Event) {
		event.preventDefault();
	}
</script>

<svelte:window ondblclick={preventDefault} oncontextmenu={preventDefault} />

{@render children()}
