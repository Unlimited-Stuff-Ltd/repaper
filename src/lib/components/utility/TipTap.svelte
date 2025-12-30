<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import Document from '@tiptap/extension-document';
	import Text from '@tiptap/extension-text';
	import Paragraph from '@tiptap/extension-paragraph';
	import { TextStyle, FontSize } from '@tiptap/extension-text-style';
	import Italic from '@tiptap/extension-italic';
	import Bold from '@tiptap/extension-bold';
	import Underline from '@tiptap/extension-underline';
	import { Loading } from '$lib/components';
	import { Button } from 'bits-ui';
	import { changed } from '$lib';

	let element: any = $state();
	let editorState: any = $state({ editor: null });

	let loading = $state(true);

	let { initial, promise, save = () => {}, editor = true, ...props } = $props();

	async function saveFunc() {
		loading = true;
		const status = await save(JSON.stringify(editorState.editor.getJSON()));
		loading = false;
		if (status === 200) {
			localStorage.removeItem('repaper-document-unsaved');
			changed.set(false);
			alert('Document saved successfully.');
		} else {
			alert('Failed to save document. Please try again later.');
		}
	}

	onMount(async () => {
		await promise;
		editorState.editor = new Editor({
			element,
			extensions: [Document, Text, Paragraph, TextStyle, FontSize, Italic, Bold, Underline],
			editorProps: {
				handlePaste: () => true,
				handleDrop: () => true
			},
			content: JSON.parse(initial),
			onTransaction: ({ editor }) => {
				editorState = { editor };
			},
			onUpdate: () => {
				changed.set(true);
			},
			autofocus: editor,
			editable: editor
		});
		loading = false;
	});

	onDestroy(() => {
		editorState.editor?.destroy();
	});

	function onbeforeunload(event: Event) {
		if ($changed) {
			event.preventDefault();
		}
	}
</script>

<svelte:window {onbeforeunload} />

<Loading show={loading} />

<div class="app relative" {...props}>
	<!--
    {#if editorState.editor}
        <div class="fixed-menu">
            <Toggle onclick={() => editorState.editor.chain().focus().toggleBold().run()}>Bold</Toggle>
        </div>
    {/if}-->
	{#if editor}
		<div class="m-auto mb-5 w-fit">
			<Button.Root onclick={saveFunc}>Save</Button.Root>
		</div>
	{/if}

	<div bind:this={element}></div>
</div>
