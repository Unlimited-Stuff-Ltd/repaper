// characters that if pressed on keyboard will be added to the text
const textToAdd =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-+[{]}\\|;:\'",<.>/?=_~` ±"¢∞§¶•ªº≠æ…˚˙©ƒå≈ç√∫˜µ≤≥÷¿˘¯Â˜';

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

export function resetTokensList() {
	tokensList = [];
}

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
function ftw(formatting: boolean[], size: string) {
	let toReturn = [size];
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
export function keydown(event: KeyboardEvent, formatting: boolean[], size: string): boolean {
	// check if key pressed should be added to the text
	if (event.key === 'ArrowLeft') {
		if (tokensList.length > Math.abs(cursorPosition)) cursorPosition -= 1;
	} else if (event.key === 'ArrowRight') {
		if (cursorPosition < 0) cursorPosition += 1;
	} else if (event.key === 'ArrowUp') {
		upKey();
	} else if (event.key === 'ArrowDown') {
		downKey();
	} else if (textToAdd.includes(event.key)) {
		tokensList.splice(tokensList.length + cursorPosition, 0, nt(event.key, ftw(formatting, size)));
		return true;
		// check if key pressed has different keycode than value and should be added to the text
	} else if (textCodesIncludes(event.key)) {
		// get value to be added to the text
		const code = textToAddCode.find((symbol) => symbol[0] === event.key) ?? ['', ''];
		tokensList.splice(tokensList.length + cursorPosition, 0, nt(code[1], ftw(formatting, size)));
		return true;
		// check if key pressed is backspace
	} else if (event.key === 'Backspace') {
		if (tokensList.length + cursorPosition !== 0) {
			tokensList.splice(tokensList.length + cursorPosition - 1, 1);
			return true;
		}
	}
	return false;
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
	let tokens: any = tokensList;
	if (cursor) {
		tokens = tokensList.toSpliced(
			position,
			0,
			nt(
				'<div class="bg-primary h-[1.2em] w-[1.5px] relative top-0.5 inline-block"></div>',
				['cursor']
			)
		);
	} else if (editor) {
		tokens = tokensList.toSpliced(
			position,
			0,
			nt('<div class="h-[1.2em] w-[1.5px] relative top-0.5 inline-block"></div>', [
				'cursor'
			])
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
	let toReturn = '';
	for (let i = 0; i < tokensList.length; i++) {
		const token = tokensList[i];
		toReturn += token.value;
		toReturn += '∆';
		toReturn += token.formatting[0];
		if (token.formatting.length > 1) {
			for (let j = 1; j < token.formatting.length; j++) {
				switch (token.formatting[j]) {
					case 'bold':
						toReturn += 'b';
						break;
					case 'italic':
						toReturn += 'i';
						break;
					case 'underline':
						toReturn += 'u';
						break;
					default:
						break;
				}
			}
		}
		toReturn += '¬';
	}
	return toReturn;
}

export function setTokens(to: string) {
	if (to === '◊') {
		return;
	}
	const toReturn: Token[] = [];
	let tokens = to.split('¬');
	if (tokens.length > 0) {
		tokens.pop();
		for (let i = 0; i < tokens.length; i++) {
			const encodedToken = tokens[i].split('∆');
			const char = encodedToken[0];
			const token = encodedToken[1].split('');
			let formatting = [false, false, false];
			if (token.includes('b')) {
				formatting[0] = true;
				token.pop();
			}
			if (token.includes('i')) {
				formatting[1] = true;
				token.pop();
			}
			if (token.includes('u')) {
				formatting[2] = true;
				token.pop();
			}
			toReturn.push(nt(char, ftw(formatting, token.join(''))));
		}
		fontSize = toReturn[toReturn.length - 1].formatting[0];
	}
	tokensList = toReturn;
}

export function getWordCount() {
	return getNumCharsNoSpace()[1] + 1;
}

export function getNumChars() {
	return tokensList.length;
}

export function getNumCharsNoSpace() {
	let num = 0;
	let numSpaces = 0;
	for (let i = 0; i < tokensList.length; i++) {
		if (tokensList[i].value !== ' ') {
			num++;
		} else {
			numSpaces++;
		}
	}
	return [num, numSpaces];
}

function getPreviousBR() {
	let previousBR = -1;
	for (let i = 0; i < tokensList.length + cursorPosition; i++) {
		if (tokensList[i].value === '<br>') {
			previousBR = i;
		}
	}
	return previousBR;
}

function getNextBR() {
	let brs = [];
	for (let i = tokensList.length - 1; i >= tokensList.length + cursorPosition; i--) {
		if (tokensList[i].value === '<br>') {
			brs.push(i);
		}
	}
	if (brs.length > 1) {
		return brs[brs.length - 2];
	} else {
		return -1;
	}
}

function upKey() {
	if (tokensList.length + cursorPosition === 0) {
		return;
	}
	const previousBR = getPreviousBR();
	if (previousBR === -1) {
		cursorPosition = -tokensList.length;
		return;
	}
	cursorPosition = -(tokensList.length - previousBR);
}

function downKey() {
	if (cursorPosition === 0) {
		return;
	}
	const nextBR = getNextBR();
	if (nextBR === -1) {
		cursorPosition = 0;
		return;
	}
	cursorPosition = -(tokensList.length - nextBR);
}
