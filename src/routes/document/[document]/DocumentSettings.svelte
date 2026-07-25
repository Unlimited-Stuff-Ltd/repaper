<script lang="ts">
	import { Button /*Label*/ } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
	//import { I, Popover, Switch } from '$lib/components';

	let { /*viewerPasswordRequired, autosave,*/ back } = $props();
	/*let renameTo = $state('');

	async function deleteF() {
		if (confirm(m.confirm_delete())) {
			await deleteFunc();
		}
	}

	async function rename(event: Event) {
		event.preventDefault();
		await renameDocument(renameTo);
	}

	async function changeCodeFunc(event: Event) {
		event.preventDefault();
		await changeCode(newCode);
	}

	async function togglePassordRequired() {
		await changePasswordRequired(!viewerPasswordRequired);
	}

	async function toggleAutosave() {
		await changeAutosave(!autosave);
	}

	async function changePasswordFunc(event: Event) {
		event.preventDefault();
		if (newPassword !== confirmNewPassword) {
			text = editor ? m.editor_passwords_dont_match() : m.viewer_passwords_dont_match();
			return;
		} else {
			text = '';
		}
		const response = await changePassword(oldPassword, newPassword, editor);
		if (response === 1) {
			text = m.current_editor_pass_incorrect();
		}
	}

	// Change Password
	let editor = $state(true);
	let oldPassword = $state('');
	let newPassword = $state('');
	let confirmNewPassword = $state('');

	//let text = $state('');

	// Change Code
	let newCode = $state('');

	let loading = $state(false);

	async function deleteFunc() {
		loading = true;
		changesMadeSinceSave = false;
		await deleteDocument({
			code: data.document,
			token
		});
		let recentDocuments: DocumentLink[] = JSON.parse(
			localStorage.getItem('repaper-recent-documents') ?? '[]'
		);
		const newRecentDocuments = recentDocuments.filter((a) => a.code !== data.document);
		localStorage.setItem('repaper-recent-documents', JSON.stringify(newRecentDocuments));
		window.location.assign('/');
	}

	async function changePassword(oldPassword: string, newPassword: string, editorPassword: boolean) {
		loading = true;
		await editor.saveFunction();
		const response = await password({
			code: data.document,
			token,
			oldPassword,
			newPassword,
			editor: editorPassword
		});
		if (response.status === 401) {
			goto(resolve('/'), { replaceState: true });
		} else if (response.status === 400) {
			loading = false;
			return 1;
		} else if (response.status === 500) {
			alert(m.something_happened());
		} else {
			window.location.reload();
		}
		showSettings = false;
		loading = false;
	}

	async function changeCode(to: string) {
		loading = true;
		await editor.saveFunction();
		const response = await code({
			code: data.document,
			token,
			newCode: to
		});
		if (response.status === 401) {
			goto(resolve('/'), { replaceState: true });
			return;
		} else if (response.status === 500) {
			alert(m.something_happened());
			return;
		} else {
			const recentDocuments = JSON.parse(localStorage.getItem('repaper-recent-documents') ?? '[]');
			const index = recentDocuments.findIndex((a: any) => a.code === data.document);
			recentDocuments.splice(index, 1);
			const document = recentDocuments[index];
			document.code = to;
			recentDocuments.splice(0, 0, document);
			localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
			window.location.assign(`/document/${to}?mode=editor`);
			return;
		}
	}

	async function changeAutosave(to: boolean) {
		loading = true;
		await editor.saveFunction();
		const response = await autosave({
			code: data.document,
			token,
			autosave: to
		});
		if (response.status === 401) {
			goto(resolve('/'), { replaceState: true });
			return;
		} else if (response.status === 500) {
			alert(m.something_happened());
			return;
		} else {
			const recentDocuments = JSON.parse(localStorage.getItem('repaper-recent-documents') ?? '[]');
			const index = recentDocuments.findIndex((a: any) => a.code === data.document);
			recentDocuments.splice(index, 1);
			const document = recentDocuments[index];
			document.autosave = to;
			recentDocuments.splice(0, 0, document);
			localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
			window.location.reload();
			return;
		}
	}

	async function changePasswordRequired(to: boolean) {
		loading = true;
		await editor.saveFunction();
		const response = await passwordRequired({
			code: data.document,
			token,
			passwordRequired: to
		});
		if (response.status === 401) {
			goto(resolve('/'), { replaceState: true });
			return;
		} else if (response.status === 500) {
			alert(m.something_happened());
			return;
		} else {
			const recentDocuments = JSON.parse(localStorage.getItem('repaper-recent-documents') ?? '[]');
			const index = recentDocuments.findIndex((a: any) => a.code === data.document);
			recentDocuments.splice(index, 1);
			const document = recentDocuments[index];
			document.passwordRequired = to;
			recentDocuments.splice(0, 0, document);
			localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
			window.location.reload();
			return;
		}
	}

	async function renameDocument(to: string) {
		loading = true;
		await editor.saveFunction();
		const response = await changeTitle({
			code: data.document,
			token,
			title: to
		});
		if (response.status === 401) {
			goto(resolve('/'), { replaceState: true });
			return;
		} else if (response.status === 500) {
			alert(m.something_happened());
			return;
		} else {
			const recentDocuments = JSON.parse(localStorage.getItem('repaper-recent-documents') ?? '[]');
			const index = recentDocuments.findIndex((a: any) => a.code === data.document);
			recentDocuments.splice(index, 1);
			const document = recentDocuments[index];
			document.title = to;
			recentDocuments.splice(0, 0, document);
			localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
			window.location.reload();
			return;
		}
	}*/
</script>

<!--
<h1 class="h1 mt-5 mb-18!">{m.document_settings()}</h1>

<div class="grid grid-cols-2">
	<div class="m-auto w-fit text-center">
		<form onsubmit={changePasswordFunc} class="block text-left">
			<h2 class="mb-3 text-3xl font-bold">
				{lang(lS, 'Change a Password', 'Changer un Mot de Passe')}
			</h2>
			{#if viewerPasswordRequired}
				<Label.Root class="block"
					>{lang(lS, 'Change Password for', 'Changer le Mot de Passe pour')}
					{editor ? lang(lS, 'Editor', 'Éditeur') : lang(lS, 'Viewer', 'Spectateur')}</Label.Root
				>
				<div class="m-auto flex w-fit gap-5">
					<Button.Root
						class="disabled:cursor-not-allowed! disabled:bg-(--fg)/20! disabled:opacity-100!"
						onclick={() => (editor = true)}
						disabled={editor}>{lang(lS, 'Editor', 'Éditeur')}</Button.Root
					>
					<Button.Root
						class="disabled:cursor-not-allowed! disabled:bg-(--fg)/20! disabled:opacity-100!"
						onclick={() => (editor = false)}
						disabled={!editor}>{lang(lS, 'Viewer', 'Spectateur')}</Button.Root
					>
				</div>
			{/if}
			<div class="m-auto mt-4 block w-fit text-left">
				<Label.Root for="oldPassword" class="block"
					>{lang(lS, 'Current Editor Password:', "Mot de Passe de l'Éditeur Actuel:")}</Label.Root
				>
				<input
					type="password"
					class="h-10 w-80"
					id="oldPassword"
					required
					bind:value={oldPassword}
				/>
			</div>
			<div class="m-auto block w-fit text-left">
				<Label.Root for="newPassword" class="block"
					>{editor
						? lang(lS, 'New Editor Password', "Mot de Passe de l'Éditeur Nouveau")
						: lang(lS, 'New Viewer Password', 'Mot de Passe du Spectateur Nouveau')}:</Label.Root
				>
				<input
					type="password"
					class="h-10 w-80"
					id="newPassword"
					required
					bind:value={newPassword}
				/>
			</div>
			<div class="m-auto w-fit text-left">
				<Label.Root for="confirmNewPassword" class="block"
					>{editor
						? lang(lS, 'Confirm New Editor Password', "Confirmer Mot de Passe de l'Éditeur Nouveau")
						: lang(
								lS,
								'Confirm New Viewer Password',
								'Confirmer Mot de Passe du Spectateur Nouveau'
							)}:</Label.Root
				>
				<div class="flex">
					<input
						type="password"
						class="h-10 w-66"
						id="confirmewPassword"
						required
						bind:value={confirmNewPassword}
					/>
					<Button.Root class="ml-2 w-fit" type="submit">{lang(lS, 'Go', 'Aller')}</Button.Root>
				</div>
			</div>
			<div class="absolute w-200">
				<p class="text-center text-(--red)">{text}<I /></p>
			</div>
		</form>
	</div>
	<div class="m-auto h-fit">
		<form onsubmit={rename} class="block text-left">
			<div class="m-auto w-fit text-left">
				<Label.Root for="rename" class="block w-fit"
					>{lang(lS, 'Rename Document', 'Renommer ce Document')}:</Label.Root
				>
				<div class="flex">
					<input type="text" class="h-10 w-50" id="rename" required bind:value={renameTo} />
					<Button.Root type="submit" class="ml-2 w-fit">{lang(lS, 'Go', 'Aller')}</Button.Root>
				</div>
			</div>
		</form>
		<hr class="m-auto mt-6 mb-4 w-100" />
		<form onsubmit={changeCodeFunc} class="block text-left">
			<div class="m-auto w-fit text-left">
				<Label.Root for="changeCode" class="block w-fit"
					>{lang(lS, 'Change Document Code', 'Changer le Code du Document')}:</Label.Root
				>
				<div class="flex">
					<input type="text" class="h-10 w-50" id="changeCode" required bind:value={newCode} />
					<Button.Root type="submit" class="ml-2 w-fit">{lang(lS, 'Go', 'Aller')}</Button.Root>
				</div>
			</div>
		</form>
		<hr class="m-auto my-8 w-100" />
		<div>
			<p>
				{lang(
					lS,
					'Password required to view document',
					'Mot de Passe requis pour spectater le document'
				)}
			</p>
			<Button.Root
				class="cursor-text! disabled:cursor-not-allowed! disabled:bg-(--fg)/20! disabled:opacity-100!"
				onclick={togglePassordRequired}
				disabled={viewerPasswordRequired}>Yes</Button.Root
			>
			<Button.Root
				class="disabled:cursor-not-allowed! disabled:bg-(--fg)/20! disabled:opacity-100!"
				onclick={togglePassordRequired}
				disabled={!viewerPasswordRequired}>{lang(lS, 'No', 'Non')}</Button.Root
			>
		</div>
		<hr class="m-auto my-8 w-100" />
		<Button.Root onclick={deleteF} class="red-button m-auto"
			>{lang(lS, 'Delete Document', 'Supprimer ce Document')}</Button.Root
		>
	</div>
	</div>

<div class="m-auto flex w-fit">
	<h3 class="mr-2 text-center text-2xl font-bold">
		{m.autosave()}
	</h3>
	<div>
		<Popover triggerClass="size-8! text-2xl" bClass="w-100! px-3!">{m.this_autosave()}</Popover>
	</div>
	<hr class="my-auto mr-5 ml-2 w-20" />
	<Switch class="my-auto" checked={autosave} />
</div>

<hr class="my-10 h-[60%]" />-->

<Button.Root class="mt-20" onclick={back}>{m.back()}</Button.Root>
