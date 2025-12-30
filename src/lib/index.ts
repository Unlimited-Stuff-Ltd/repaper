import { writable } from 'svelte/store';

export const changed = writable(false);

export type Character = {
	value: string;
	bold: boolean;
	italic: boolean;
	underline: boolean;
	fontSize: number;
};

export type DocumentLink = {
	title: string;
	code: string;
	mode: string;
	link: any;
	token: string;
};
