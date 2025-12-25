<script lang="ts">
	import { Select, SelectItem } from '$lib/components';
	import { setMode, mode, setTheme, theme } from 'mode-watcher';

	type SelectItemType = {
		value: string;
		label: string;
	};

	// Light/Dark

	let themes = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' }
	];

	const selectedModeLabel = $derived(
		themes.find((theme: SelectItemType) => theme.value === mode.current)
	);

	function onThemeChange(value: 'light' | 'dark') {
		setMode(value);
	}

	// Font

	let fonts = [
		{ value: 'serif', label: '<span class="font-[serif]">Serif</span>' },
		{ value: 'sans-serif', label: '<span class="font-[sans-serif]">Sans Serif</span>' },
		{ value: 'cursive', label: '<span class="font-[cursive]">Cursive</span>' },
		{ value: 'monospace', label: '<span class="font-[monospace]">Monospace</span>' }
	];

	const selectedFontLabel = $derived(
		fonts.find((font: SelectItemType) => font.value === theme.current)
	);

	function onFontChange(value: string) {
		setTheme(value);
	}
</script>

<div>
	<h1 class="h1">Settings</h1>
	<Select onValueChange={onThemeChange} trigger={selectedModeLabel?.label}>
		{#each themes as theme, i (i + theme.value)}
			<SelectItem value={theme} />
		{/each}
	</Select>
	<Select onValueChange={onFontChange} trigger={selectedFontLabel?.label}>
		{#each fonts as theme, i (i + theme.value)}
			<SelectItem value={theme} />
		{/each}
	</Select>
</div>
