<script lang="ts">
	import { goto } from '$app/navigation';
	import { Loading, I } from '$lib/components';
	import { Label, Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
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
			text = m.incorrect();
			loading = false;
			return;
		} else if (response.status === 500) {
			text = m.something_happened();
			loading = false;
			return;
		}
		localStorage.setItem('repaper-token', response.ls);
		goto(response.link, { replaceState: true });
	}
</script>

<svelte:head>
	<title>{m.open_document()} - Repaper</title>
</svelte:head>

<Loading show={loading} />

<div>
	<h1 class="h1">{m.open_document()}</h1>
	<form {onsubmit}>
		<div class="m-auto mb-5 w-fit text-left">
			<Label.Root for="code">{m.code()}:</Label.Root><br />
			<input id="code" class="h-10 w-120" bind:value={code} maxlength="50" required />
		</div>
		<div class="m-auto mb-0.5 w-fit text-left">
			<Label.Root for="password">{m.password()}:</Label.Root><br />
			<input id="password" class="h-10 w-120" bind:value={password} type="password" />
		</div>
		<p class="mb-3 text-left text-sm text-(--red)"><I />{text}</p>
		<Button.Root type="submit">{m.go()}</Button.Root>
	</form>
</div>
