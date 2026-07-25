<script lang="ts">
	import { goto } from '$app/navigation';
	import { Checkbox, Popover, Loading, I } from '$lib/components';
	import { Label, Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
	import { openDocument } from '$lib/actions.remote';
	import { createDocument } from './actions.remote';

	let loading = $state(false);

	let codeText = $state('');
	let editorPText = $state('');
	let viewerPText = $state('');

	let title = $state('');
	let code = $state('');
	let editorPassword = $state('');
	let confirmEditorPassword = $state('');
	let viewerPassword = $state('');
	let confirmViewerPassword = $state('');

	let passwordRequired = $state(false);
	let autosave = $state(true);

	const codeCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789-';

	function checkCode(code: string): boolean {
		for (let i = 0; i < code.length; i++) {
			if (!codeCharacters.includes(code[i])) {
				return false;
			}
		}
		return true;
	}

	function check() {
		let errors = 0;
		if (!checkCode(code)) {
			codeText = m.invalid_code();
			errors++;
		} else {
			codeText = '';
		}
		if (editorPassword === viewerPassword) {
			viewerPText = m.passwords_cannot_match();
			errors++;
		} else if (viewerPassword === confirmViewerPassword) {
			viewerPText = '';
		}
		if (editorPassword !== confirmEditorPassword) {
			editorPText = m.editor_passwords_dont_match();
			errors++;
		} else {
			editorPText = '';
		}
		if (viewerPassword !== confirmViewerPassword) {
			viewerPText = m.viewer_passwords_dont_match();
			errors++;
		}
		return errors;
	}

	async function onsubmit(event: Event) {
		event.preventDefault();
		loading = true;
		let errors = check();
		if (errors > 0) {
			loading = false;
			return;
		}
		const createResponse = await createDocument({
			title,
			code,
			editorPassword,
			viewerPassword,
			passwordRequired,
			autosave,
			classroom: false
		});
		if (createResponse.status === 409) {
			codeText = m.document_code_taken();
			loading = false;
			return;
		}
		const openResponse = await openDocument({
			code,
			password: editorPassword
		});
		if (openResponse.status === 401 || openResponse.status === 500) {
			codeText = m.something_happened();
			loading = false;
			return;
		}
		localStorage.setItem('repaper-token', openResponse.ls);
		goto(openResponse.link, { replaceState: true });
	}
</script>

<svelte:head>
	<title>{m.create_document()} - Repaper</title>
</svelte:head>

<Loading show={loading} />

<div>
	<h1 class="h1">{m.create_document()}</h1>
	<form {onsubmit}>
		<div class="m-auto mb-5 w-fit text-left">
			<Label.Root for="title"
				>{m.document_title()}:
				<Popover>{m.this_title()}</Popover>
			</Label.Root><br />
			<input
				id="title"
				autocomplete="off"
				class="mt-0.5 h-10 w-120"
				bind:value={title}
				maxlength="50"
				required
			/>
		</div>
		<div class="m-auto mb-0.5 w-fit text-left">
			<Label.Root for="code"
				>{m.code()}:
				<Popover>
					{m.this_code()}
				</Popover>
			</Label.Root><br />
			<input
				id="code"
				autocomplete="off"
				class="mt-0.5 h-10 w-120"
				bind:value={code}
				maxlength="50"
				required
			/>
			<p class="text-sm text-(--red)"><I />{codeText}</p>
		</div>
		<div class="m-auto mb-0.5 inline-flex">
			<div class="text-left">
				<Label.Root for="editorPassword"
					>{m.editor_password()}:
					<Popover>
						{m.this_editor_password()}
					</Popover>
				</Label.Root><br />
				<input
					id="editorPassword"
					class="mt-0.5 mr-3 h-10 w-58"
					bind:value={editorPassword}
					type="password"
					autocomplete="off"
					required
				/>
			</div>
			<div class="text-left">
				<Label.Root for="confirmEditorPassword">{m.confirm()} {m.editor_password()}</Label.Root><br
				/>
				<input
					id="confirmEditorPassword"
					bind:value={confirmEditorPassword}
					class="mt-0.5 h-10 w-58"
					type="password"
					autocomplete="off"
					required
				/>
			</div>
		</div>
		<p class="text-left text-sm text-(--red)"><I />{editorPText}</p>
		<div class="m-auto mb-0.5 inline-flex">
			<div class="text-left">
				<Label.Root
					for="viewerPassword"
					class={passwordRequired ? '' : 'cursor-not-allowed text-(--fg)/50'}
					>{m.viewer_password()}:
					<Popover disabled={!passwordRequired}>
						{m.this_viewer_password()}
					</Popover>
				</Label.Root><br />
				<input
					id="viewerPassword"
					autocomplete="off"
					class="mt-0.5 mr-3 h-10 w-58 disabled:cursor-not-allowed disabled:bg-(--fg)/2"
					bind:value={viewerPassword}
					type="password"
					required={passwordRequired}
					disabled={!passwordRequired}
				/>
			</div>
			<div class="text-left">
				<Label.Root
					for="confirmViewerPassword"
					class={passwordRequired ? '' : 'cursor-not-allowed text-(--fg)/50'}
					>{m.confirm()} {m.viewer_password()}</Label.Root
				><br />
				<input
					id="confirmViewerPassword"
					autocomplete="off"
					bind:value={confirmViewerPassword}
					class="mt-0.5 h-10 w-58 disabled:cursor-not-allowed disabled:bg-(--fg)/2"
					type="password"
					required={passwordRequired}
					disabled={!passwordRequired}
				/>
			</div>
		</div>
		<p class="text-left text-sm text-(--red)"><I />{viewerPText}</p>
		<div class="flex">
			<div class="m-auto mb-7 flex w-fit">
				<Checkbox bind:checked={passwordRequired} id="passwordRequired" />
				<Label.Root class="ml-2" for="passwordRequired">
					{m.password_required()}
					<Popover>
						{m.this_password_required()}
					</Popover>
				</Label.Root>
			</div>
			<div class="m-auto mb-7 flex w-fit">
				<Checkbox bind:checked={autosave} id="autosave" />
				<Label.Root class="ml-2" for="autosave">
					{m.autosave()}
					<Popover>
						{m.this_autosave()}
					</Popover>
				</Label.Root>
			</div>
		</div>
		<Button.Root type="submit">{m.go()}</Button.Root>
	</form>
	<a class="a mt-6 block" href="/help/create" target="_blank">{m.need_help()}</a>
</div>
