import { command, getRequestEvent } from '$app/server';
import { object, string, boolean } from 'valibot';
import { checkToken } from '$lib/server/db/token';
import { db } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { success, error } from '$lib/server/db/logs';

const TitleSchema = object({
	code: string(),
	token: string(),
	title: string()
});

export const changeTitle = command(
	TitleSchema,
	async (data: { code: string; token: string; title: string }) => {
		const { request } = getRequestEvent();
		const userAgent = request.headers.get('user-agent') ?? '';

		const tokenCheck = await checkToken(userAgent, data.token, data.code, 'editor');
		if (!tokenCheck) {
			return { status: 401 };
		}
		try {
			await db
				.update(documents)
				.set({
					title: data.title
				})
				.where(eq(documents.code, data.code));
		} catch (errorV) {
			error({
				userAgent,
				info: `code:${data.code},token:${data.token},title:${data.title}`,
				action: 'rename-document',
				error: JSON.stringify(errorV)
			});
			return { status: 500 };
		}
		success({
			userAgent,
			info: `code:${data.code},token:${data.token},title:${data.title}`,
			action: 'rename-document'
		});
		return { status: 200 };
	}
);

const PasswordRequiredSchema = object({
	code: string(),
	token: string(),
	passwordRequired: boolean()
});

export const passwordRequired = command(
	PasswordRequiredSchema,
	async (data: { code: string; token: string; passwordRequired: boolean }) => {
		const { request } = getRequestEvent();
		const userAgent = request.headers.get('user-agent') ?? '';
		const tokenCheck = await checkToken(userAgent, data.token, data.code, 'editor');
		if (!tokenCheck) {
			return { status: 401 };
		}
		try {
			await db
				.update(documents)
				.set({
					passwordRequired: data.passwordRequired
				})
				.where(eq(documents.code, data.code));
		} catch (errorV) {
			error({
				userAgent,
				info: `code:${data.code},token:${data.token},required:${data.passwordRequired}`,
				action: 'change-pass-req',
				error: JSON.stringify(errorV)
			});
			return { status: 500 };
		}
		success({
			userAgent,
			info: `code:${data.code},token:${data.token},required:${data.passwordRequired}`,
			action: 'change-pass-req'
		});
		return { status: 200 };
	}
);

const PasswordSchema = object({
	code: string(),
	token: string(),
	oldPassword: string(),
	newPassword: string(),
	editor: boolean()
});

export const password = command(
	PasswordSchema,
	async (data: {
		code: string;
		token: string;
		oldPassword: string;
		newPassword: string;
		editor: boolean;
	}) => {
		const { request } = getRequestEvent();
		const userAgent = request.headers.get('user-agent') ?? '';

		const tokenCheck = await checkToken(userAgent, data.token, data.code, 'editor');
		if (!tokenCheck) {
			return { status: 401 };
		}
		try {
			const document = await db.query.documents.findFirst({
				columns: {
					code: true,
					editorPassword: true
				},
				where: eq(documents.code, data.code)
			});
			if (data.code !== document?.code || document?.editorPassword !== data.oldPassword) {
				return { status: 400 };
			}
			if (data.editor) {
				await db
					.update(documents)
					.set({
						editorPassword: data.newPassword
					})
					.where(eq(documents.code, data.code));
			} else {
				await db
					.update(documents)
					.set({
						viewerPassword: data.newPassword
					})
					.where(eq(documents.code, data.code));
			}
		} catch (errorV) {
			error({
				userAgent,
				info: `code:${data.code},token:${data.token}`,
				action: 'password-reset-get-doc',
				error: JSON.stringify(errorV)
			});
			return { status: 500 };
		}
		success({
			userAgent,
			info: `code:${data.code},token:${data.token}`,
			action: 'password-reset-get-doc'
		});
		return { status: 200 };
	}
);

const CodeSchema = object({
	code: string(),
	token: string(),
	newCode: string()
});

export const code = command(
	CodeSchema,
	async (data: { code: string; token: string; newCode: string }) => {
		const { request } = getRequestEvent();
		const userAgent = request.headers.get('user-agent') ?? '';

		const tokenCheck = await checkToken(userAgent, data.token, data.code, 'editor');
		if (!tokenCheck) {
			return { status: 401 };
		}
		try {
			await db
				.update(documents)
				.set({
					code: data.newCode
				})
				.where(eq(documents.code, data.code));
		} catch (errorV) {
			error({
				userAgent,
				info: `code:${data.code},newCode:${data.newCode}`,
				action: 'change-doc-code',
				error: JSON.stringify(errorV)
			});
			return { status: 500 };
		}
		success({
			userAgent,
			info: `code:${data.code},newCode:${data.newCode}`,
			action: 'change-doc-code'
		});
		return { status: 200 };
	}
);

const AutosaveSchema = object({
	code: string(),
	token: string(),
	autosave: boolean()
});

export const autosave = command(
	AutosaveSchema,
	async (data: { code: string; token: string; autosave: boolean }) => {
		const { request } = getRequestEvent();
		const userAgent = request.headers.get('user-agent') ?? '';

		const tokenCheck = checkToken(userAgent, data.token, data.code, 'editor');
		if (!tokenCheck) {
			return { status: 401 };
		}
		try {
			await db
				.update(documents)
				.set({
					autosave: data.autosave
				})
				.where(eq(documents.code, data.code));
		} catch (errorV) {
			error({
				userAgent,
				info: `code:${data.code},token:${data.token},autosave:${data.autosave}`,
				action: 'change-doc-autosave',
				error: JSON.stringify(errorV)
			});
			return { status: 500 };
		}
		success({
			userAgent,
			info: `code:${data.code},token:${data.token},autosave:${data.autosave}`,
			action: 'change-doc-autosave'
		});
		return { status: 200 };
	}
);
