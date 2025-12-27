import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import { success, error } from '$lib/server/db/logs';

export const POST: RequestHandler = async ({ request }) => {
	const requestJson = await request.json();
	const title = requestJson.title;
	const code = requestJson.code;
	const editorPassword = requestJson.editorPassword;
	const viewerPassword = requestJson.viewerPassword;
	const passwordRequired = requestJson.passwordRequired;
	const userAgent = request.headers.get('user-agent') ?? 'not-found';
	try {
		if (passwordRequired) {
			await db.insert(documents).values({
				title,
				code,
				editorPassword,
				viewerPassword,
				passwordRequired: 1
			});
		} else {
			await db.insert(documents).values({
				title,
				code,
				editorPassword,
				passwordRequired: 0
			});
		}
	} catch (errorO) {
		error({
			action: 'create-document',
			info: `title:${title}`,
			error: JSON.stringify(errorO),
			userAgent
		});
		return new Response(JSON.stringify({ error: errorO }), { status: 409 });
	}
	success({
		action: 'create-document',
		info: `title:${title}`,
		userAgent
	});
	return new Response(JSON.stringify({ success: true }), { status: 201 });
};
