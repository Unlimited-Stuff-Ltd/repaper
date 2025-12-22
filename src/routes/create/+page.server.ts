import type { Actions } from './$types';
import { success, error } from '$lib/server/db/logs';
import { db } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';

const codeCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789-';

function checkCode(code: string): boolean {
	for (let i = 0; i < code.length; i++) {
		if (!codeCharacters.includes(code[i])) {
			return false;
		}
	}
	return true;
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const title = String(data.get('title'));
		const code = String(data.get('code'));
		const editorPassword = String(data.get('editorPassword'));
		const confirmEditorPassword = String(data.get('confirmEditorPassword'));
		const viewerPassword = String(data.get('viewerPassword'));
		const confirmViewerPassword = String(data.get('confirmViewerPassword'));
		if (!checkCode(code)) {
			redirect(303, '/create?e=1');
		}
		if (editorPassword !== confirmEditorPassword) {
			redirect(303, '/create?e=2');
		}
		if (viewerPassword !== confirmViewerPassword) {
			redirect(303, '/create?e=3');
		}
		const userAgent = request.headers.get('user-agent') ?? 'not-found';
		try {
			await db.insert(documents).values({
				title,
				code,
				editorPassword,
				viewerPassword
			});
		} catch (errorO) {
			error({
				action: 'create-document',
				info: `title:${title}`,
				error: JSON.stringify(errorO),
				userAgent
			});
			redirect(303, '/create?e=5');
		}
		success({
			action: 'create-document',
			info: `title:${title}`,
			userAgent
		});
		redirect(303, `/file/${code}/`);
	}
} satisfies Actions;
