<script lang="ts">
	import { goto } from '$app/navigation';
	import { Checkbox, Popover, Loading, I } from '$lib/components';
	import { Label, Button } from 'bits-ui';
	import { onMount } from 'svelte';
	import lang, { languageState as lS } from '$lib/lang.svelte';
	import { openDocument } from '$lib/actions.remote';
	import { createDocument } from './actions.remote';

	let account: string | null = $state(null);
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
	let associateAccount = $state(false);
	let autosave = $state(true);

	onMount(() => {
		const accountLS = localStorage.getItem('repaper-account');
		if (accountLS) {
			account = accountLS;
		}
	});

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
			codeText = lang(
				lS,
				'Code can only contain numbers, lowercase letters and hyphens.',
				"Le code peut seulement contenir les nombres, les lettres miniscules et les traits d'union."
			);
			errors++;
		} else {
			codeText = '';
		}
		if (editorPassword === viewerPassword) {
			viewerPText = lang(
				lS,
				'Editor Password and Viewer Password cannot match.',
				"Mot de Passe de l'Éditeur et Mot de Passe du Spectateur ne peuvent pas être les mêmes."
			);
			errors++;
		} else if (viewerPassword === confirmViewerPassword) {
			viewerPText = '';
		}
		if (editorPassword !== confirmEditorPassword) {
			editorPText = lang(
				lS,
				'Editor Password and Confirm Editor Password do not match.',
				"Mot de Passe de l'Éditeur et Confirmer Mot de Passe de l'Éditeur ne sont pas les mêmes."
			);
			errors++;
		} else {
			editorPText = '';
		}
		if (viewerPassword !== confirmViewerPassword) {
			viewerPText = lang(
				lS,
				'Viewer Password and Confirm Viewer Password do not match.',
				'Mot de Passe du Spectateur et Confirmer Mot de Passe du Spectateur ne sont pas les mêmes.'
			);
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
			codeText = lang(lS, 'Document code is already taken.', 'Code du Document est déjà pris.');
			loading = false;
			return;
		}
		const openResponse = await openDocument({
			code,
			password: editorPassword
		});
		if (openResponse.status === 401 || openResponse.status === 500) {
			codeText = lang(
				lS,
				'Something unexpected happened on our end. Please try again later.',
				"Quelque chose inattendu s'est passé sur notre dimension. Essayez encore s'il vout plaît."
			);
			loading = false;
			return;
		}
		localStorage.setItem('repaper-token', openResponse.ls);
		goto(openResponse.link, { replaceState: true });
	}
</script>

<svelte:head>
	<title>{lang(lS, 'Create a Document - Repaper', 'Créer un Document - Repaper')}</title>
</svelte:head>

<Loading show={loading} />

<div>
	<h1 class="h1">{lang(lS, 'Create a Document', 'Créer un Document')}</h1>
	<form {onsubmit}>
		<div class="m-auto mb-5 w-fit text-left">
			<Label.Root for="title"
				>{lang(lS, 'Document Title', 'Titre du Document')}:
				<Popover
					>{@html lang(
						lS,
						'This is the title of the document.',
						"Ceci c'est le titre du document."
					)}</Popover
				>
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
				>{lang(lS, 'Document Code', 'Code du Document')}:
				<Popover>
					{@html lang(
						lS,
						'This is the code to access the document.',
						"Ceci c'est le code pour accéder au document."
					)}
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
					>{lang(lS, 'Editor Password', "Mot de Passe de l'Éditeur")}:
					<Popover>
						{@html lang(
							lS,
							'This is the password used to edit the document.',
							"Ceci c'est le mot de passe utilisé pour changer le document."
						)}
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
				<Label.Root for="confirmEditorPassword"
					>{@html lang(
						lS,
						'Confirm Editor Password:',
						'<span class="text-sm">Confirmer Mot de Passe de l\'Éditeur:</span>'
					)}</Label.Root
				><br />
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
					>{lang(lS, 'Viewer Password', 'Mot de Passe du Spectateur')}:
					<Popover disabled={!passwordRequired}>
						{@html lang(
							lS,
							'This is the password used to view the document.',
							"Ceci c'est le mot de passe utilisé pour regarder le document."
						)}
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
					>{@html lang(
						lS,
						'Confirm Viewer Password:',
						'<span class="text-xs">Confirmer Mot de Passe du Spectateur:</span>'
					)}</Label.Root
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
					{lang(lS, 'Password required to view', 'Mot de Passe requis pour regarder')}
					<Popover>
						{@html lang(
							lS,
							'If this is checked, anyone can view this document with just the document code.',
							"Si ceci est coché, n'importe qui pourrait voir ce document avec seulement le code du document."
						)}
					</Popover>
				</Label.Root>
			</div>
			<div class="m-auto mb-7 flex w-fit">
				<Checkbox bind:checked={autosave} id="autosave" />
				<Label.Root class="ml-2" for="autosave">
					{lang(lS, 'Autosave', 'Enregistrement Automatique')}
					<Popover>
						{@html lang(
							lS,
							'If this is checked, this document will automatically save in the background.',
							'Si ceci est coché, ce document enregistera automatique dans le fond.'
						)}
					</Popover>
				</Label.Root>
			</div>
		</div>
		{#if account}
			<div class="m-auto mb-7 flex w-fit">
				<Checkbox bind:checked={associateAccount} id="associateAccount" />
				<Label.Root class="ml-2" for="associateAccount"
					>{lang(lS, 'Associate with account', 'Associer avec un compte')}</Label.Root
				>
			</div>
		{/if}
		<Button.Root type="submit">{lang(lS, 'Create', 'Créer')}</Button.Root>
	</form>
	<a class="a mt-6 block" href="/help/create" target="_blank"
		>{lang(lS, 'Need Help?', "Besoin d'Aide?")}</a
	>
</div>
