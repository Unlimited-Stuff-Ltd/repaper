export type Character = {
	value: string;
	bold: boolean;
	italic: boolean;
	underline: boolean;
	fontSize: number;
};

export function decode(s: string): Character[] {
	if (s === 'empty') {
		return [];
	}
	const decoded = [];
	const chars = s.split('¬');
	for (let i = 0; i < chars.length; i++) {
		let char = chars[i];
		const character = {
			value: char[0],
			bold: false,
			italic: false,
			underline: false,
			fontSize: 1
		};
		char = char.substring(1);
		const [style, size] = char.split('-');
		if (style.includes('b')) {
			character.bold = true;
		}
		if (style.includes('i')) {
			character.italic = true;
		}
		if (style.includes('u')) {
			character.underline = true;
		}
		character.fontSize = Number(size);
		decoded.push(character);
	}
	return decoded;
}

export function encode(chars: Character[]): string {
	if (chars.length === 0) {
		return 'empty';
	}
	let encoded = '';
	for (let i = 0; i < chars.length; i++) {
		const char = chars[i];
		if (char.value === undefined) {
			continue;
		}
		let toAdd = char.value;
		if (char.bold) {
			toAdd += 'b';
		}
		if (char.italic) {
			toAdd += 'i';
		}
		if (char.underline) {
			toAdd += 'u';
		}
		toAdd += `-${char.fontSize}`;
		if (encoded === '') {
			encoded += toAdd;
		} else {
			encoded += `¬${toAdd}`;
		}
	}
	return encoded;
}

export type DocumentLink = {
	title: string;
	code: string;
	mode: string;
	// eslint-disable-next-line
	link: any;
	token: string;
};
