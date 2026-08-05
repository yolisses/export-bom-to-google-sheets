export function parseCsv(text: string): Array<Array<string>> {
	const rows: Array<Array<string>> = [];
	let row: Array<string> = [];
	let value = '';
	let inQuotes = false;

	for (let i = 0; i < text.length; i += 1) {
		const char = text[i];
		const nextChar = text[i + 1];

		if (char === '"') {
			if (inQuotes && nextChar === '"') {
				value += '"';
				i += 1;
			}
			else {
				inQuotes = !inQuotes;
			}
			continue;
		}

		if (char === ',' && !inQuotes) {
			row.push(value);
			value = '';
			continue;
		}

		if ((char === '\r' || char === '\n') && !inQuotes) {
			if (char === '\r' && nextChar === '\n') {
				i += 1;
			}
			row.push(value);
			rows.push(row);
			row = [];
			value = '';
			continue;
		}

		value += char;
	}

	if (value !== '' || row.length > 0) {
		row.push(value);
		rows.push(row);
	}

	if (rows.length > 0 && rows[0].length > 0 && rows[0][0].startsWith('\uFEFF')) {
		rows[0][0] = rows[0][0].slice(1);
	}

	return rows;
}
