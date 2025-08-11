import { jsPDF } from 'jspdf';

export function saveAsPDF() {
	const doc = new jsPDF();
	doc.text('Repaper', 10, 10);
	doc.save('test.pdf');
}
