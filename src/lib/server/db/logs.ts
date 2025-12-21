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

export function success(data: SuccessData) {
	db.insert(logs).values({
		userAgent: data.userAgent,
		action: data.action,
		info: data.info
	});
}

export function error(data: ErrorData) {
	db.insert(logs).values({
		userAgent: data.userAgent,
		action: data.action,
		info: data.info,
		error: data.error,
		success: 0
	});
}
