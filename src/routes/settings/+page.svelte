<script lang="ts">
	import { SelectC, SelectItem } from '$lib/components';
	import { setTheme, theme } from 'mode-watcher';
	import { Label, Select } from 'bits-ui';
	import { onMount } from 'svelte';

	type SelectItemType = {
		value: string;
		label: string;
	};

	let currentTheme = $state('');
	let currentFont = $state('');

	onMount(() => {
		const themeCurrent = theme.current;
		const split = themeCurrent?.split('-') ?? ['default', 'georgia'];
		currentTheme = split[0];
		currentFont = split[1];
	});

	// Light/Dark

	let themes = [
		{ value: 'default', label: 'Default', mode: 'light' },
		{ value: 'coral', label: 'Coral', mode: 'light' },
		{ value: 'cucumber', label: 'Cucumber', mode: 'light' },
		{ value: 'wumpus', label: 'Wumpus', mode: 'dark' },
		{ value: 'og', label: 'OG', mode: 'dark' },
		{ value: 'nord', label: 'Nord', mode: 'dark' }
	];

	let fonts = [
		{ value: 'georgia', label: 'Georgia' },
		{ value: 'arial', label: 'Arial' },
		{ value: 'tahoma', label: 'Tahoma' },
		{ value: 'times', label: 'Times New Roman' },
		{ value: 'trebuchet', label: 'Trebuchet MS' },
		{ value: 'system', label: 'System' }
	];

	const selectedModeLabel = $derived(
		themes.find((themeV: SelectItemType) => themeV.value === currentTheme)
	);

	const selectedFontLabel = $derived(
		fonts.find((font: SelectItemType) => font.value === currentFont)
	);

	function onThemeChange(value: string) {
		currentTheme = value;
		setTheme(`${currentTheme}-${currentFont}`);
	}

	function onFontChange(value: string) {
		currentFont = value;
		setTheme(`${currentTheme}-${currentFont}`);
	}
</script>

<div>
	<h1 class="h1">Settings</h1>
	<div class="m-auto mb-5 w-fit">
		<Label.Root for="theme">Theme:</Label.Root>
		<SelectC
			bind:value={currentTheme}
			id="theme"
			onValueChange={onThemeChange}
			trigger={selectedModeLabel?.label}
		>
			<Select.Group>
				<Select.GroupHeading class="group-heading">Light Themes</Select.GroupHeading>
				{#each themes as theme, i (i + theme.value)}
					{#if theme.mode === 'light'}
						<SelectItem value={theme} />
					{/if}
				{/each}
			</Select.Group>
			<Select.Group>
				<Select.GroupHeading class="group-heading">Dark Themes</Select.GroupHeading>
				{#each themes as theme, i (i + theme.value)}
					{#if theme.mode === 'dark'}
						<SelectItem value={theme} />
					{/if}
				{/each}
			</Select.Group>
		</SelectC>
	</div>
	<div class="m-auto w-fit">
		<Label.Root for="font">Font:</Label.Root>
		<SelectC
			bind:value={currentFont}
			font={currentFont}
			id="font"
			onValueChange={onFontChange}
			trigger={selectedFontLabel?.label}
		>
			{#each fonts as theme, i (i + theme.value)}
				<SelectItem value={theme} />
			{/each}
		</SelectC>
	</div>
</div>
