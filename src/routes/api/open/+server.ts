import type { RequestHandler } from './$types';
import { error } from '$lib/server/db/logs';
import { db } from '$lib/server/db';
import { documents, sessions } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	const userAgent = request.headers.get('user-agent') || '';
	const requestJson = await request.json();
	const code = requestJson.code;
	const password = requestJson.password;
	let editDocuments = [];
	let viewDocuments = [];
	try {
		editDocuments = await db
			.select()
			.from(documents)
			.where(and(eq(documents.code, code), eq(documents.editorPassword, password)));
		viewDocuments = await db
			.select()
			.from(documents)
			.where(and(eq(documents.code, code), eq(documents.viewerPassword, password)));
	} catch (errorO) {
		error({
			action: 'open-document',
			userAgent,
			info: `code:${code} password:${password}`,
			error: JSON.stringify(errorO)
		});
		return new Response(null, { status: 500 });
	}
	let permissions = 'viewer';
	if (editDocuments.length === 0 && viewDocuments.length === 0) {
		return new Response(null, { status: 401 });
	} else if (viewDocuments.length === 0) {
		permissions = 'editor';
	}
	let s;
	try {
		const [{ token }] = await db
			.insert(sessions)
			.values({
				permissions,
				documentCode: code,
				userAgent
			})
			.returning({ token: sessions.token });
		s = token;
	} catch (errorV) {
		error({
			action: 'create-token',
			info: `p.:${permissions},code:${code}`,
			error: JSON.stringify(errorV),
			userAgent
		});
	}
	return new Response(
		JSON.stringify({
			link: `/document/${code}?mode=${permissions}`,
			ls: s
		}),
		{ status: 200 }
	);
};
