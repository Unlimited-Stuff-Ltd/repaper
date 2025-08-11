import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://repaper.pockethost.io/');

export type Result = {
	success: boolean;
	name: string;
	value: string;
	file: string;
};

export async function getFile(username: string, password: string, signIn: boolean) {
	try {
		if (signIn) await pb.collection('users').authWithPassword(username, password);
		const file = (
			await pb.collection('files').getFullList({
				expand: 'editUser,viewUser'
			})
		)[0];
		return { success: true, name: file.name, value: file.value, file: JSON.stringify(file) };
	} catch (error: any) {
		return { success: false, name: '', value: error.message, file: '' };
	}
}

export async function deleteFilePB(fileStr: string) {
	try {
		const file = JSON.parse(fileStr);
		await pb.collection('files').delete(file.id);
		await pb.collection('users').delete(file.viewUser);
		await pb.collection('users').delete(file.editUser);
		return { success: true, error: '' };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}

export async function saveFile(tokens: string, fileStr: string) {
	try {
		const file = JSON.parse(fileStr);
		await pb.collection('files').update(file.id, {
			value: tokens
		});
		return { success: true, error: '' };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}

export async function renameFilePB(to: string, fileStr: string) {
	try {
		const file = JSON.parse(fileStr);
		await pb.collection('files').update(file.id, { name: to });
		return { success: true, error: '' };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}

function generateID() {
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	const charactersLength = characters.length;
	for (let i = 0; i < 9; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export async function createFile(
	name: string,
	editorCode: string,
	editorPassword: string,
	viewerCode: string,
	viewerPassword: string
) {
	const random = generateID();
	try {
		await pb.collection('users').create({
			id: random + 'editor',
			username: editorCode,
			password: editorPassword,
			passwordConfirm: editorPassword,
			editor: true
		});
		await pb.collection('users').create({
			id: random + 'viewer',
			username: viewerCode,
			password: viewerPassword,
			passwordConfirm: viewerPassword,
			editor: false,
			editorUser: random + 'editor'
		});
		await pb.collection('files').create({
			id: random + 'fileid',
			name,
			value: '[]',
			editUser: random + 'editor',
			viewUser: random + 'viewer'
		});
		await pb.collection('users').authWithPassword(editorCode, editorPassword);
		return { success: true, error: '' };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}
