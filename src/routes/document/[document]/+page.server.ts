import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, url }) => {
	const mode = url.searchParams.get('mode');
	if (!mode) {
		return redirect(303, '/recents');
	}
	const document = db.query.documents.findFirst({
		columns: {
			title: true,
			content: true,
			passwordRequired: true,
			autosave: true
		},
		where: eq(documents.code, params.document)
	});
	return {
		document: params.document,
		promise: document,
		mode
	};
};

/*
onMount(async () => {
		if ($fullscreen) {
			scale = 100;
		}
		const documentCU = await data.promise;
		let recentDocuments: DocumentLink[] = JSON.parse(
			localStorage.getItem('repaper-recent-documents') ?? '[]'
		);
		let i = recentDocuments.findIndex((a) => a.code === data.document);
		const tokenV = localStorage.getItem('repaper-token');
		if (!tokenV) {
			goto(resolve('/recents'), { replaceState: true });
			return;
		}
		token = tokenV;
		const tokenCheck = await checkToken({
			token,
			documentCode: page.params.document ?? '',
			permissions: mode
		});
		if (!documentCU || !tokenCheck) {
			if (i !== -1) {
				recentDocuments.splice(i, 1);
				localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
			}
			goto(resolve('/recents'), { replaceState: true });
			return;
		}
		document.title = documentCU.title ?? '';
		document.content = documentCU.content;
		document.passwordRequired = documentCU.passwordRequired;
		document.autosave = documentCU.autosave;
		resolveP(true);
		loading = false;
		if (i !== -1) {
			recentDocuments.splice(i, 1);
		}
		const current = {
			title: document.title,
			code: data.document,
			link: `/document/${data.document}?mode=${mode}`,
			mode,
			token
		};
		recentDocuments.splice(0, 0, current);
		localStorage.setItem('repaper-recent-documents', JSON.stringify(recentDocuments));
	});
*/
