import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import { success, error } from '$lib/server/db/logs';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const title = String(data.get('title'));
	const code = String(data.get('code'));
	const editorPassword = String(data.get('editorPassword'));
	const viewerPassword = String(data.get('viewerPassword'));
	const userAgent = request.headers.get('user-agent') ?? 'not-found';
	try {
		await db.insert(documents).values({
			title,
			code,
			editorPassword,
			viewerPassword
		});
	} catch (errorO) {
		error({
			action: 'create-document',
			info: `title:${title}`,
			error: JSON.stringify(errorO),
			userAgent
		});
		return new Response(JSON.stringify({ error: errorO }));
	}
	success({
		action: 'create-document',
		info: `title:${title}`,
		userAgent
	});
	return new Response(JSON.stringify({ success: true }));
};
