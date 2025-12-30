import { db } from '$lib/server/db';
import { error, success } from '$lib/server/db/logs';
import { documents } from '$lib/server/db/schema';
import { checkToken } from '$lib/server/db/token';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const userAgent = request.headers.get('user-agent') ?? '';
	const json = await request.json();
	const code = json.code;
	const token = json.token;
	const title = json.title;
	const tokenCheck = await checkToken(userAgent, token, code, 'editor');
	if (!tokenCheck) {
		return new Response(null, { status: 401 });
	}
	try {
		await db
			.update(documents)
			.set({
				title
			})
			.where(eq(documents.code, code));
	} catch (errorV) {
		error({
			userAgent,
			info: `code:${code},token:${token},title:${title}`,
			action: 'rename-document',
			error: JSON.stringify(errorV)
		});
	}
	success({
		userAgent,
		info: `code:${code},token:${token},title:${title}`,
		action: 'rename-document'
	});
	return new Response(null, { status: 200 });
};
