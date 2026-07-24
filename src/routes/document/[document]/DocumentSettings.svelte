<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import lang, { languageState as lS } from '$lib/lang.svelte';
	import { I, Switch } from '$lib/components';

	let {
		deleteFunc,
		renameDocument,
		viewerPasswordRequired,
		autosave,
		changePassword,
		changeCode,
		changePasswordRequired,
		changeAutosave,
		back
	} = $props();

	let renameTo = $state('');

	async function deleteF() {
		if (
			confirm(
				lang(
					lS,
					'Are you sure you want to delete this document? This action cannot be undone.',
					'Vous êtes certains que vous voulez supprimer ce document ? Cette action ne peut pas être annulé.'
				)
			)
		) {
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
			text = editor
				? lang(
						lS,
						"New Editor Password and Confirm New Editor Password aren't the same.",
						"Mot de Passe de l'Éditeur Nouveau et Confirmer Mot de Passe de l'Éditeur Nouveau ne sont pas les mêmes."
					)
				: lang(
						lS,
						"New Viewer Password and Confirm New Viewer Password aren't the same.",
						'Mot de Passe du Spectateur Nouveau et Confirmer Mot de Passe du Spectateur Nouveau ne sont pas les mêmes.'
					);
			return;
		} else {
			text = '';
		}
		const response = await changePassword(oldPassword, newPassword, editor);
		if (response === 1) {
			text = lang(
				lS,
				'Current Editor Password is Incorrect.',
				"Mot de Passe de l'Éditeur Actuel est Incorrect."
			);
		}
	}

	// Change Password
	let editor = $state(true);
	let oldPassword = $state('');
	let newPassword = $state('');
	let confirmNewPassword = $state('');

	let text = $state('');

	// Change Code
	let newCode = $state('');
</script>

<h1 class="h1 mb-18!">{lang(lS, 'Document Settings', 'Paramètres du Document')}</h1>

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
		<hr class="m-auto my-8 w-100" />
		<div>
			<p>
				{lang(lS, 'Autosave', 'Enregistrement automatique')}
			</p>
			<Button.Root
				class="disabled:cursor-not-allowed! disabled:bg-(--fg)/20! disabled:opacity-100!"
				onclick={toggleAutosave}
				disabled={autosave}>{lang(lS, 'Yes', 'Oui')}</Button.Root
			>
			<Button.Root
				class="disabled:cursor-not-allowed! disabled:bg-(--fg)/20! disabled:opacity-100!"
				onclick={toggleAutosave}
				disabled={!autosave}>{lang(lS, 'No', 'Non')}</Button.Root
			>
		</div>
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

<div class="m-auto w-140">
	<h3 class="text-center text-2xl font-bold">
		{lang(lS, 'Autosave', 'Enregistrement Automatique')}
	</h3>
	<div class="grid grid-cols-2 gap-4">
		<p class="w-full text-right leading-5">
			{lang(
				lS,
				'Whether the document saves automatically every 60 seconds',
				'Si le document enregistre automatiquement chaque 60 secondes.'
			)}
		</p>
		<Switch class="my-auto" />
	</div>
</div>

<hr class="my-10 h-[60%]" />

<Button.Root class="mt-20" onclick={back}>{lang(lS, 'Back', 'Retourner')}</Button.Root>
