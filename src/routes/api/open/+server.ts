import type { RequestHandler } from './$types';
import { openFn } from '$lib/open';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const userAgent = request.headers.get('user-agent') || '';
	const requestJson = await request.json();
	const code = requestJson.code;
	let password = null;
	if (requestJson.password) {
		password = requestJson.password;
	}

	const response = await openFn({ code, password }, userAgent);

	if (response.status !== 200) {
		return new Response(null, { status: response.status });
	}
	return json(response);
};
