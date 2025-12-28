import { checkToken } from '$lib/server/db/token';
import type { RequestHandler } from './$types';
import { error, success } from '$lib/server/db/logs';
import { db } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	const userAgent = request.headers.get('user-agent') ?? '';
	const json = await request.json();
	const content = json.content;
	const code = json.code;
	const token = json.token;
	const tokenCheck = checkToken(userAgent, token, code, 'editor');
	if (!tokenCheck) {
		return new Response(null, { status: 401 });
	}
	try {
		await db
			.update(documents)
			.set({
				content
			})
			.where(eq(documents.code, code));
	} catch (errorV) {
		error({
			userAgent,
			info: `code:${code},token:${token}`,
			action: 'save-file',
			error: JSON.stringify(errorV)
		});
		return new Response(null, { status: 500 });
	}
	success({
		userAgent,
		info: `code:${code},token:${token}`,
		action: 'save-file'
	});
	return new Response(null, { status: 200 });
};
