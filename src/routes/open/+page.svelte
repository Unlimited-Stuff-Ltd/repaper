<script lang="ts">
	import { goto } from '$app/navigation';
	import { Loading, I } from '$lib/components';
	import { Label, Button } from 'bits-ui';
	import { resolve } from '$app/paths';

	let loading = $state(false);

	let code = $state('');
	let password = $state('');

	let text = $state('');

	async function onsubmit(event: Event) {
		event.preventDefault();
		loading = true;
		const response = await fetch('/api/open', {
			method: 'POST',
			body: JSON.stringify({
				code,
				password
			})
		});
		if (response.status === 401) {
			text = 'Document code or password is wrong.';
			loading = false;
			return;
		} else if (response.status === 500) {
			text = 'Something unexpected happened on our end. Please try again later.';
			loading = false;
			return;
		}
		const json = await response.json();
		localStorage.setItem('repaper-token', json.ls);
		goto(resolve(json.link), { replaceState: true });
	}
</script>

<Loading show={loading} />

<div>
	<h1 class="h1">Open a Document</h1>
	<form {onsubmit}>
		<div class="m-auto mb-5 w-fit text-left">
			<Label.Root for="code">Document Code:</Label.Root><br />
			<input id="code" class="w-120" bind:value={code} maxlength="50" required />
		</div>
		<div class="m-auto mb-0.5 w-fit text-left">
			<Label.Root for="password">Password:</Label.Root><br />
			<input id="password" class="w-120" bind:value={password} type="password" />
		</div>
		<p class="mb-3 text-left text-sm text-(--red)"><I />{text}</p>
		<Button.Root type="submit">Open</Button.Root>
	</form>
</div>
