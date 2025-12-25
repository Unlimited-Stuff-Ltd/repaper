<script lang="ts">
	import { Select, SelectItem } from '$lib/components';
	import { setTheme, theme } from 'mode-watcher';
	import { Label } from 'bits-ui';

	type SelectItemType = {
		value: string;
		label: string;
	};

	let currentTheme = $state('');
	let currentFont = $state('');

	// Light/Dark

	let themes = [
		{ value: 'default', label: 'Default' },
		{ value: 'discord', label: 'Discord' }
	];

	const selectedModeLabel = $derived(
		themes.find((themeV: SelectItemType) => themeV.value === currentTheme)
	);

	function onThemeChange(value: string) {
		currentTheme = value;
		setTheme(`${currentTheme}-${currentFont}`);
	}

	// Font

	let fonts = [
		{ value: 'serif', label: '<span class="font-[serif]">Serif</span>' },
		{ value: 'sans', label: '<span class="font-[sans-serif]">Sans Serif</span>' },
		{ value: 'cursive', label: '<span class="font-[cursive]">Cursive</span>' },
		{ value: 'monospace', label: '<span class="font-[monospace]">Monospace</span>' }
	];

	const selectedFontLabel = $derived(
		fonts.find((font: SelectItemType) => font.value === currentFont)
	);

	function onFontChange(value: string) {
		currentFont = value;
		setTheme(`${currentTheme}-${currentFont}`);
	}
</script>

<div>
	<h1 class="h1">Settings</h1>
	<div class="m-auto mb-5 w-fit">
		<Label.Root for="theme">Theme:</Label.Root>
		<Select id="theme" onValueChange={onThemeChange} trigger={selectedModeLabel?.label}>
			{#each themes as theme, i (i + theme.value)}
				<SelectItem value={theme} />
			{/each}
		</Select>
	</div>
	<div class="m-auto w-fit">
		<Label.Root for="font">Font:</Label.Root>
		<Select id="font" onValueChange={onFontChange} trigger={selectedFontLabel?.label}>
			{#each fonts as theme, i (i + theme.value)}
				<SelectItem value={theme} />
			{/each}
		</Select>
	</div>
</div>
