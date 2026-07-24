import { command, getRequestEvent, query } from '$app/server';
import { checkToken as checkTokenFn } from '$lib/server/db/token';
import { object, string } from 'valibot';
import { db } from '$lib/server/db';
import { documents, sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '$lib/server/db/logs';

const TokenSchema = object({
	documentCode: string(),
	token: string(),
	permissions: string()
});

export const checkToken = query(
	TokenSchema,
	async (data: { documentCode: string; token: string; permissions: string }) => {
		const { request } = getRequestEvent();
		const userAgent = request.headers.get('user-agent') ?? '';

		const tokenCheck = await checkTokenFn(
			userAgent,
			data.token,
			data.documentCode,
			data.permissions
		);

		return { tokenCheck };
	}
);

const SaveSchema = object({
	content: string(),
	code: string(),
	token: string()
});

export const saveDocument = command(
	SaveSchema,
	async (data: { content: string; code: string; token: string }) => {
		const { request } = getRequestEvent();
		const userAgent = request.headers.get('user-agent') ?? '';
		const tokenCheck = await checkTokenFn(userAgent, data.token, data.code, 'editor');
		if (!tokenCheck) {
			return { status: 401 };
		}
		try {
			await db
				.update(documents)
				.set({
					content: data.content
				})
				.where(eq(documents.code, data.code));
		} catch (errorV) {
			error({
				userAgent,
				info: `code:${data.code},token:${data.token}`,
				action: 'save-file',
				error: JSON.stringify(errorV)
			});
			return { status: 500 };
		}
		return { status: 200 };
	}
);

const DeleteSchema = object({
	code: string(),
	token: string()
});

export const deleteDocument = command(
	DeleteSchema,
	async (data: { code: string; token: string }) => {
		const { request } = getRequestEvent();
		const userAgent = request.headers.get('user-agent') ?? '';

		const tokenCheck = await checkTokenFn(userAgent, data.token, data.code, 'editor');
		if (!tokenCheck) {
			return new Response(null, { status: 401 });
		}
		try {
			await db.delete(sessions).where(eq(sessions.documentCode, data.code));
			await db.delete(documents).where(eq(documents.code, data.code));
		} catch (errorV) {
			error({
				userAgent,
				info: `code:${data.code},token:${data.token}`,
				action: 'delete-document',
				error: JSON.stringify(errorV)
			});
			return new Response(null, { status: 500 });
		}
		return new Response(null, { status: 204 });
	}
);
