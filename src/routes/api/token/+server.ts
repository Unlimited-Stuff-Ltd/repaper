import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { error } from '$lib/server/db/logs';

export const POST: RequestHandler = async ({ request }) => {
	const userAgent = request.headers.get('user-agent') ?? '';
	const json = await request.json();
	const token = json.token;
	const documentCode = json.documentCode;
	let session;
	try {
		session = await db
			.select()
			.from(sessions)
			.where(
				and(
					eq(sessions.token, token),
					eq(sessions.documentCode, documentCode),
					eq(sessions.userAgent, userAgent)
				)
			);
	} catch (errorV) {
		error({
			action: 'check-token',
			info: `token:${token},code:${documentCode}`,
			error: JSON.stringify(errorV),
			userAgent
		});
	}
	if (!session || session.length === 0) {
		return new Response(null, { status: 401 });
	}
	return new Response(null, { status: 200 });
};
