<script lang="ts">
	import { Select } from '$lib/components';

	let theme = $state('light');

	let themes = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' }
	];
</script>

<div>
	<h1 class="h1">Settings</h1>
	<Select {themes} bind:value={theme} />
</div>
