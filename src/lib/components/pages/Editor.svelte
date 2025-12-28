<script lang="ts">
	import { Text, TextCursor } from '$lib/components';

	const allowedChars =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+=_.,?!@#$%^&*()][{}\'">< ';

	const specialChars = [
		{ code: 'Backspace', func: backspace },
		{ code: 'ArrowLeft', func: arrowLeft },
		{ code: 'ArrowRight', func: arrowRight }
	];

	let { document, scale } = $props();

	let bold = $state(false);
	let italic = $state(false);
	let underline = $state(false);

	let blinking = $state(true);

	let fontSize = $state(1);

	let cursorPos = $state(0);

	function backspace() {
		if (document.content.length > 0 && document.content.length - cursorPos > 0) {
			document.content.splice(document.content.length - (cursorPos + 1), 1);
		}
	}

	function arrowLeft() {
		if (cursorPos < document.content.length) {
			cursorPos++;
		}
	}

	function arrowRight() {
		if (cursorPos > 0) {
			cursorPos--;
		}
	}

	function type(event: KeyboardEvent) {
		event.preventDefault();
		blinking = false;
		if (allowedChars.includes(event.key)) {
			document.content.splice(document.content.length - cursorPos, 0, {
				value: event.key,
				bold,
				italic,
				underline,
				fontSize
			});
		} else {
			const specialChar = specialChars.find((a) => a.code === event.key);
			if (specialChar) {
				specialChar.func();
			} else {
				return;
			}
		}
	}
</script>

<svelte:window
	onkeydown={type}
	onkeyup={() => (blinking = true)}
	onfocus={() => (blinking = true)}
	onblur={() => (blinking = false)}
/>

<div class="h-screen" style="width: calc(100vw - 17.5rem)">
	<h2 class="mt-8 text-center text-lg font-bold text-(--fg)/60">Edit</h2>
	<h1 class="h1">{document.title}</h1>
	<div class="page" style="transform: scale({scale / 100}); margin-top: -{(100 - scale) / 2.25}%">
		<pre class="content"><TextCursor
				cursor={true}
				{blinking}
				{cursorPos}
				content={document.content}
			/></pre>
		<pre class="content relative -top-6"><Text content={document.content} /></pre>
	</div>
	<div class="h-[2vw]"></div>
</div>
