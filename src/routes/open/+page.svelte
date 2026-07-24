<script lang="ts">
	import { goto } from '$app/navigation';
	import { Loading, I } from '$lib/components';
	import { Label, Button } from 'bits-ui';
	import lang, { languageState as lS } from '$lib/lang.svelte';
	import { openDocument } from '$lib/actions.remote';

	let loading = $state(false);

	let code = $state('');
	let password = $state('');

	let text = $state('');

	async function onsubmit(event: Event) {
		event.preventDefault();
		loading = true;
		const response = await openDocument({
			code,
			password
		});
		if (response.status === 401) {
			text = lang(
				lS,
				'Document code or password is wrong.',
				'Code du document ou mot de passe est incorrect.'
			);
			loading = false;
			return;
		} else if (response.status === 500) {
			text = lang(
				lS,
				'Something unexpected happened on our end. Please try again later.',
				"Quelque chose inattendu s'est passé sur notre dimension. Essayez encore s'il vout plaît."
			);
			loading = false;
			return;
		}
		localStorage.setItem('repaper-token', response.ls);
		goto(response.link, { replaceState: true });
	}
</script>

<svelte:head>
	<title>{lang(lS, 'Open a Document - Repaper', 'Ouvrir un Document - Repaper')}</title>
</svelte:head>

<Loading show={loading} />

<div>
	<h1 class="h1">{lang(lS, 'Open a Document', 'Ouvrir un Document')}</h1>
	<form {onsubmit}>
		<div class="m-auto mb-5 w-fit text-left">
			<Label.Root for="code">{lang(lS, 'Document Code', 'Code du Document')}:</Label.Root><br />
			<input id="code" class="h-10 w-120" bind:value={code} maxlength="50" required />
		</div>
		<div class="m-auto mb-0.5 w-fit text-left">
			<Label.Root for="password">{lang(lS, 'Password', 'Mot de Passe')}:</Label.Root><br />
			<input id="password" class="h-10 w-120" bind:value={password} type="password" />
		</div>
		<p class="mb-3 text-left text-sm text-(--red)"><I />{text}</p>
		<Button.Root type="submit">{lang(lS, 'Open', 'Ouvrir')}</Button.Root>
	</form>
</div>
