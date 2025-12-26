import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const document = db.query.documents.findFirst({
		columns: {
			title: true,
			content: true
		},
		where: eq(documents.code, params.document)
	});
	return {
		document: params.document,
		promise: document
	};
};
