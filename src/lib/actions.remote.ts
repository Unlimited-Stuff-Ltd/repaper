import { command, getRequestEvent } from '$app/server';
import { object, string, nullable } from 'valibot';
import { openFn, type OpenData } from '$lib/open';
import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { error } from '$lib/server/db/logs';
import { eq } from 'drizzle-orm';

const OpenSchema = object({
	code: string(),
	password: nullable(string())
});

export const openDocument = command(OpenSchema, async (data: OpenData) => {
	const { request } = getRequestEvent();
	const userAgent = request.headers.get('user-agent') ?? '';

	return await openFn(data, userAgent);
});

export const forgetDocument = command(string(), async (token: string) => {
	const { url, request } = getRequestEvent();

	const host = url.hostname;
	if (!(host === 'localhost' && import.meta.env.DEV) && host !== 'repaper.unlimitedstuffltd.com') {
		return { status: 401 };
	}

	const userAgent = request.headers.get('user-agent') ?? '';
	try {
		await db.delete(sessions).where(eq(sessions.token, token));
	} catch (errorV) {
		error({
			userAgent,
			info: `token:${token}`,
			action: 'delete-sessions',
			error: JSON.stringify(errorV)
		});
		return { status: 500 };
	}
	return { status: 200 };
});
