<script lang="ts">
	import { Switch } from 'bits-ui';

	let { checked = $bindable(false), ...props } = $props();
</script>

<Switch.Root bind:checked {...props}>
	<Switch.Thumb />
</Switch.Root>
