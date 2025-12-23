import { db } from '$lib/server/db';
import { logs } from '$lib/server/db/schema';

type SuccessData = {
	action: string;
	info: string;
	userAgent: string;
};

type ErrorData = {
	action: string;
	info: string;
	error: string;
	userAgent: string;
};

export async function success(data: SuccessData) {
	try {
		await db.insert(logs).values({
			userAgent: data.userAgent,
			action: data.action,
			info: data.info
		});
	} catch (error) {
		console.log(error);
	}
}

export async function error(data: ErrorData) {
	try {
		await db.insert(logs).values({
			userAgent: data.userAgent,
			action: data.action,
			info: data.info,
			error: data.error,
			success: 0
		});
	} catch (error) {
		console.log(error);
	}
}
