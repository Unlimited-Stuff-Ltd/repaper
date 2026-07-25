<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor, Extension } from '@tiptap/core';
	import { Loading, Toggle, Popover, Select } from '$lib/components';
	import {
		Document,
		Text,
		Paragraph,
		TextStyle,
		Italic,
		Bold,
		Underline,
		UndoRedo,
		HorizontalRule,
		Heading
	} from '$lib/extensions';
	import { Button } from 'bits-ui';
	import { changed } from '$lib';
	import { m } from '$lib/paraglide/messages';
	import { downloadDocument } from '$lib/pdf';
	import fullscreen from '$lib/fullscreen';

	let element: any = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	let loading = $state(true);
	let saving = $state(false);

	let hasFocus = $state(true);

	let { initial, promise, save = () => {}, autosave: as, title, editor = true, scale } = $props();

	export async function saveFunc(after = false, failed = true, l = true) {
		if (after) {
			loading = true;
		} else {
			saving = l;
		}
		const status = await save(editorState.editor?.getHTML());
		loading = after;
		saving = after;
		if (status === 200) {
			localStorage.removeItem('repaper-document-unsaved');
			changed.set(false);
		} else if (failed) {
			alert(m.something_happened());
		}
	}

	export const Keybindings = Extension.create({
		addKeyboardShortcuts() {
			return {
				F1: () => this.editor.commands.setHeading({ level: 1 }),
				F2: () => this.editor.commands.setHeading({ level: 2 }),
				F3: () => this.editor.commands.setParagraph(),
				Tab: () => this.editor.commands.insertContent('\t')
			};
		}
	});

	onMount(async () => {
		await promise;
		let i = initial;
		if (i[0] === '{') {
			i = JSON.parse(initial);
		}
		if (!document.hasFocus()) {
			hasFocus = false;
		}
		editorState.editor = new Editor({
			element,
			extensions: [
				Document,
				Text,
				Paragraph,
				TextStyle,
				Heading,
				Italic,
				Bold,
				Underline,
				UndoRedo,
				HorizontalRule,
				Keybindings
			],
			editorProps: {
				handlePaste: () => true,
				handleDrop: () => true
			},
			content: i,
			onTransaction: ({ editor }) => {
				editorState = { editor };
			},
			onUpdate: () => {
				changed.set(true);
			},
			onSelectionUpdate: () => {
				if (editorState.editor?.isActive('heading', { level: 1 })) {
					textStyle = 'h1';
				} else if (editorState.editor?.isActive('heading', { level: 2 })) {
					textStyle = 'h2';
				} else if (editorState.editor?.isActive('paragraph')) {
					textStyle = 'p';
				}
			},
			autofocus: editor,
			editable: editor
		});
		setInterval(autosave, 60 * 1000);
		loading = false;
	});

	async function autosave() {
		if (editor && as && hasFocus) {
			await saveFunc(false, false, false);
		}
	}

	onDestroy(() => {
		editorState.editor?.destroy();
	});

	function onbeforeunload(event: Event) {
		if ($changed) {
			event.preventDefault();
		}
	}

	let wordCount = $derived(
		editorState.editor
			?.getText()
			.split(' ')
			.filter((word) => word !== '').length
	);

	let selectionWordCount = $derived(
		editorState.editor?.state.doc
			.textBetween(editorState.editor?.state.selection.from, editorState.editor?.state.selection.to)
			.split(' ')
			.filter((word) => word !== '').length
	);

	async function download() {
		loading = true;

		await downloadDocument(title, editorState.editor?.getHTML() ?? '');

		loading = false;
	}

	let textStyles = [
		{ value: 'h1', label: 'Heading' },
		{ value: 'h2', label: 'Subheading' },
		{ value: 'p', label: 'Body' }
	];

	let textStyle = $state('p');

	function textStyleChange(value: string) {
		textStyle = value;
		switch (value) {
			case 'h1':
				editorState.editor?.chain().focus().setHeading({ level: 1 }).run();
				break;
			case 'h2':
				editorState.editor?.chain().focus().setHeading({ level: 2 }).run();
				break;
			case 'p':
				editorState.editor?.chain().focus().setParagraph().run();
				break;
		}
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'p' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			download();
		} else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
			saveFunc(false);
		}
	}

	function onfocus() {
		hasFocus = true;
	}

	function onblur() {
		hasFocus = false;
	}
</script>

<svelte:window {onbeforeunload} {onkeydown} {onblur} {onfocus} />

<Loading show={loading} />

{#snippet sharedButtons()}
	<Button.Root onclick={download}>{m.download_pdf()}</Button.Root>
	<Popover questionMark={false} bClass="mr-10" message={m.document_info()}
		>{m.word_count()}: <strong>{wordCount}</strong>
		{m.words()}<br />{#if selectionWordCount || 0 > 0}
			{m.selection_word_count()}:
			<strong>{selectionWordCount}</strong>
			{m.words()}{/if}</Popover
	>
{/snippet}

{#if editorState.editor && editor}
	<div
		class="sticky top-0 z-30 mb-5 border-b border-(--o) bg-(--bg) py-5 {$fullscreen
			? 'left-0 w-screen'
			: 'left-70 w-[calc(100vw-17.5rem)]'}"
	>
		<div class="m-auto flex w-fit gap-3">
			{@render sharedButtons()}
			<Select
				options={textStyles}
				onValueChange={textStyleChange}
				itemClass="z-50!"
				styling={false}
				bind:value={textStyle}
			/>
			<Toggle
				onclick={() => editorState.editor?.chain().focus().toggleBold().run()}
				active={editorState.editor.isActive('bold')}>{m.bold()}</Toggle
			>
			<Toggle
				onclick={() => editorState.editor?.chain().focus().toggleItalic().run()}
				active={editorState.editor.isActive('italic')}>{m.italic()}</Toggle
			>
			<Toggle
				onclick={() => editorState.editor?.chain().focus().toggleUnderline().run()}
				active={editorState.editor.isActive('underline')}>{m.underline()}</Toggle
			>
			{#if !saving}
				<Button.Root class="ml-10" onclick={() => saveFunc(false)}>{m.save()}</Button.Root>
			{:else}
				<Button.Root class="ml-2 cursor-not-allowed! opacity-50!">{m.saving()}</Button.Root>
			{/if}
		</div>
	</div>
{:else}
	<div class="m-auto mb-6 w-fit">
		{@render sharedButtons()}
	</div>
{/if}

<div class="tiptap-container">
	<div bind:this={element} style={scale} spellcheck="false" class="relative overflow-visible"></div>
</div>
