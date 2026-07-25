<script lang="ts">
	import { Select as EnhancedSelect } from '$lib/components';
	import { setTheme, theme } from 'mode-watcher';
	import { Label } from 'bits-ui';
	import { onMount } from 'svelte';
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages';

	let currentTheme = $state('');
	let currentFont = $state('');

	let locale = $state(getLocale());

	onMount(() => {
		const themeCurrent = theme.current;
		const split = themeCurrent?.split('-') ?? ['default', 'georgia'];
		currentTheme = split[0];
		currentFont = split[1];
	});

	// Light/Dark

	let themes = [
		{ value: 'default', label: '1', mode: 'light' },
		{ value: 'og', label: 'OG', mode: 'dark' }
	];

	function onThemeChange(value: string) {
		currentTheme = value;
		setTheme(`${currentTheme}-${currentFont}`);
	}

	// Fonts

	let fonts = [
		{ value: 'georgia', label: 'Georgia' },
		{ value: 'arial', label: 'Arial' },
		{ value: 'tahoma', label: 'Tahoma' },
		{ value: 'times', label: 'Times New Roman' },
		{ value: 'trebuchet', label: 'Trebuchet MS' },
		{ value: 'system', label: 'System' }
	];

	function onFontChange(value: string) {
		currentFont = value;
		setTheme(`${currentTheme}-${currentFont}`);
	}

	// Language

	let languages = [
		{ value: 'en', label: 'English' },
		{ value: 'fr', label: 'Français' }
	];

	function onLangChange(value: 'en' | 'fr') {
		setLocale(value);
	}
</script>

<svelte:head>
	<title>{m.settings_title()} - Repaper</title>
</svelte:head>

<div class="text-left">
	<h1 class="h1">{m.settings_title()}</h1>
	<div class="m-auto mb-5 w-fit">
		<Label.Root for="theme">{m.settings_theme()}:</Label.Root>
		<EnhancedSelect bind:value={currentTheme} options={themes} onValueChange={onThemeChange} />
	</div>
	<div class="m-auto mb-5 w-fit">
		<Label.Root for="font">{m.settings_font()}:</Label.Root>
		<EnhancedSelect bind:value={currentFont} options={fonts} onValueChange={onFontChange} />
	</div>
	<div class="m-auto w-fit">
		<Label.Root for="lang">{m.settings_language()}:</Label.Root>
		<EnhancedSelect bind:value={locale} options={languages} onValueChange={onLangChange} />
	</div>
</div>
