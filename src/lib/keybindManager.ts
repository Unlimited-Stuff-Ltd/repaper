// characters that if pressed on keyboard will be added to the text
const textToAdd: string[] = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'0',
	'!',
	'@',
	'#',
	'$',
	'%',
	'^',
	'&',
	'*',
	'(',
	')',
	'-',
	'+',
	'[',
	'{',
	']',
	'}',
	'\\',
	'|',
	';',
	':',
	"'",
	'"',
	',',
	'<',
	'.',
	'>',
	'/',
	'?',
	' ',
	'=',
	'_',
	'~'
];

// character with keycodes that are different than their values to can be added to the text
const textToAddCode: string[][] = [
	['Tab', '    '],
	['Enter', '<br>']
];

// the text is made up of tokens which contain the value of each character and its formatting
// token type
type Token = {
	value: string;
	formatting: string[];
};

// list of tokens
let tokensList: Token[] = [];

let cursorPosition = 0;

// check if character has different value than keycode
function textCodesIncludes(code: string) {
	// iterate through each item that has a different keycode than value
	for (let i = 0; i < textToAddCode.length; i++) {
		// check if key pressed has a different keycode than value
		if (textToAddCode[i][0] === code) {
			return true;
		}
	}
	return false;
}

// simplify creating token process
// nt stands for new token
function nt(value: string, formatting: string[]) {
	return { value, formatting };
}

// ftw stands for formatting to words
function ftw(formatting: boolean[], size: number) {
	let toReturn = [String(size)];
	if (formatting[0]) {
		toReturn.push('bold');
	}
	if (formatting[1]) {
		toReturn.push('italic');
	}
	if (formatting[2]) {
		toReturn.push('underline');
	}
	return toReturn;
}

// function ran when key is pressed down
export function keydown(event: KeyboardEvent, formatting: boolean[], size: number) {
	// check if key pressed should be added to the text
	if (event.key === 'ArrowLeft') {
		if (tokensList.length > Math.abs(cursorPosition)) cursorPosition -= 1;
	} else if (event.key === 'ArrowRight') {
		if (cursorPosition < 0) cursorPosition += 1;
	} else if (event.key === 'ArrowUp') {
	} else if (event.key === 'ArrowDown') {
	} else if (textToAdd.includes(event.key)) {
		tokensList.splice(tokensList.length + cursorPosition, 0, nt(event.key, ftw(formatting, size)));
		// check if key pressed has different keycode than value and should be added to the text
	} else if (textCodesIncludes(event.key)) {
		// get value to be added to the text
		const code = textToAddCode.find((symbol) => symbol[0] === event.key) ?? ['', ''];
		tokensList.splice(tokensList.length + cursorPosition, 0, nt(code[1], ftw(formatting, size)));
		// check if key pressed is backspace
	} else if (event.key === 'Backspace') {
		if (tokensList.length + cursorPosition !== 0) {
			tokensList.splice(tokensList.length + cursorPosition - 1, 1);
		}
	}
}

let italicClass = '';
let fontSize = '1';

export function setFontSize(newSize: number) {
	fontSize = String(newSize);
}

export function toggleItalic() {
	if (italicClass === 'italic') italicClass = '';
	else italicClass = 'italic';
}

// return value of text
export function getText(cursor: boolean, editor: boolean = true) {
	const position = tokensList.length + cursorPosition;
	let tokens: any;
	if (cursor) {
		tokens = tokensList.toSpliced(
			position,
			0,
			nt(
				'<span class="font-bold text-(--primary) ' +
					italicClass +
					'" style="font-size: ' +
					fontSize +
					'em;">|</span>',
				['cursor']
			)
		);
	} else if (editor) {
		tokens = tokensList.toSpliced(
			position,
			0,
			nt(
				'<span class="font-bold text-transparent ' +
					italicClass +
					'" style="font-size: ' +
					fontSize +
					'em;">|</span>',
				['cursor']
			)
		);
	}
	let toReturn = '';
	// iterate through each token
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		let before = '<span style="font-size: ' + token.formatting[0] + 'em;">';
		let after = '</span>';
		if (token.formatting.includes('bold')) {
			before = '<strong>' + before;
			after += '</strong>';
		}
		if (token.formatting.includes('italic')) {
			before = '<em>' + before;
			after += '</em>';
		}
		if (token.formatting.includes('underline')) {
			before = '<u>' + before;
			after += '</u>';
		}
		if (token.formatting[0] !== 'cursor') {
			toReturn += before + token.value + after;
		} else {
			toReturn += token.value;
		}
	}
	return toReturn;
}

export function getTokensText() {
	return JSON.stringify(tokensList);
}

export function setTokens(to: string) {
	tokensList = JSON.parse(to);
}

function findNextNewline() {
	let currentIndex = tokensList.length + cursorPosition + 1;
	for (let i = currentIndex; i < tokensList.length; i++) {
		if (tokensList[i].value === '<br>') {
			return i;
		}
	}
}

function findLastNewLine() {
	let currentIndex = tokensList.length + cursorPosition - 1;
	for (let i = currentIndex; i >= 0; i--) {
		if (tokensList[i].value === '<br>') {
			return i;
		}
	}
}
