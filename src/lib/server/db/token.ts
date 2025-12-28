import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { error } from '$lib/server/db/logs';

export async function checkToken(
	userAgent: string,
	token: string,
	documentCode: string,
	permissions: string
) {
	let session;
	try {
		session = await db
			.select()
			.from(sessions)
			.where(
				and(
					eq(sessions.token, token),
					eq(sessions.documentCode, documentCode),
					eq(sessions.permissions, permissions)
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
		return false;
	}
	return true;
}
