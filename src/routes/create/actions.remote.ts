import { db } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import { success, error } from '$lib/server/db/logs';
import { getRequestEvent } from '$app/server';
import { object, string, boolean, nullable } from 'valibot';
import { command } from '$app/server';

const codeCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789-';

function check(code: string, editorPassword: string, viewerPassword: string) {
	for (let i = 0; i < code.length; i++) {
		if (!codeCharacters.includes(code[i])) {
			return false;
		}
	}
	if (editorPassword === viewerPassword) {
		return false;
	}
	return true;
}

const CreateSchema = object({
	title: string(),
	code: string(),
	editorPassword: string(),
	viewerPassword: string(),
	passwordRequired: boolean(),
	autosave: boolean(),
	classroom: nullable(boolean(), false)
});

export const createDocument = command(CreateSchema, async (data) => {
	const { request } = getRequestEvent();
	const userAgent = request.headers.get('user-agent') ?? 'not-found';

	if (!check(data.code, data.editorPassword, data.viewerPassword)) {
		return { status: 400 };
	}
	try {
		if (data.passwordRequired) {
			await db.insert(documents).values({
				title: data.title,
				code: data.code,
				editorPassword: data.editorPassword,
				viewerPassword: data.viewerPassword,
				classroom: data.classroom,
				passwordRequired: true,
				autosave: data.autosave
			});
		} else {
			await db.insert(documents).values({
				title: data.title,
				code: data.code,
				editorPassword: data.editorPassword,
				classroom: data.classroom,
				passwordRequired: false,
				autosave: data.autosave
			});
		}
	} catch (errorO: any) {
		error({
			action: 'create-document',
			info: `title:${data.title}`,
			error: JSON.stringify(errorO),
			userAgent
		});
		return { error: errorO.message, status: 409 };
	}
	success({
		action: 'create-document',
		info: `title:${data.title}`,
		userAgent
	});
	return { success: true, status: 201 };
});
