import { db } from '$lib/server/db';
import { documents, sessions } from '$lib/server/db/schema';
import { checkToken } from '$lib/server/db/token';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { error } from '$lib/server/db/logs';

export const POST: RequestHandler = async ({ request }) => {
	const userAgent = request.headers.get('user-agent') ?? '';
	const json = await request.json();
	const code = json.code;
	const token = json.token;
	const tokenCheck = await checkToken(userAgent, token, code, 'editor');
	if (!tokenCheck) {
		return new Response(null, { status: 401 });
	}
	try {
		await db.delete(sessions).where(eq(sessions.documentCode, code));
		await db.delete(documents).where(eq(documents.code, code));
	} catch (errorV) {
		error({
			userAgent,
			info: `code:${code},token:${token}`,
			action: 'delete-document',
			error: JSON.stringify(errorV)
		});
		return new Response(null, { status: 500 });
	}
	return new Response(null, { status: 204 });
};
