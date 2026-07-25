import { db } from '$lib/server/db';
import { documents, sessions } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { error } from '$lib/server/db/logs';

export type OpenData = {
	code: string;
	password: string | null;
};

export const openFn = async (data: OpenData, userAgent: string) => {
	let editDocuments = [];
	let viewDocuments;
	try {
		if (data.password) {
			editDocuments = await db.select().from(documents).where(eq(document.code, data.code));
			//.where(and(eq(documents.code, data.code), eq(documents.editorPassword, data.password)));
			viewDocuments = await db
				.select()
				.from(documents)
				.where(and(eq(documents.code, data.code), eq(documents.viewerPassword, data.password)));
		} else {
			viewDocuments = await db
				.select()
				.from(documents)
				.where(and(eq(documents.code, data.code), eq(documents.passwordRequired, false)));
		}
	} catch (errorO) {
		error({
			action: 'open-document',
			userAgent,
			info: `code:${data.code} password:${data.password}`,
			error: JSON.stringify(errorO)
		});
		return { status: 500, link: '', ls: '' };
	}
	let permissions = 'viewer';
	if (editDocuments.length === 0 && viewDocuments.length === 0) {
		return { status: 401, link: '', ls: '' };
	} else if (viewDocuments.length === 0) {
		permissions = 'editor';
	}
	let s;
	try {
		const [{ token }] = await db
			.insert(sessions)
			.values({
				permissions,
				documentCode: data.code,
				userAgent
			})
			.returning({ token: sessions.token });
		s = token;
	} catch (errorV) {
		error({
			action: 'create-token',
			info: `p.:${permissions},code:${data.code}`,
			error: JSON.stringify(errorV),
			userAgent
		});
		return { status: 500, link: '', ls: '' };
	}
	return {
		link: `/document/${data.code}?mode=${permissions}`,
		ls: s
	};
};
