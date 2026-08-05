export async function appendRowsToSheet(
	spreadsheetId: string,
	sheetName: string,
	rows: Array<Array<string>>,
	accessToken: string): Promise<void> {
	const encodedRange = encodeURIComponent(`${sheetName}!A1`);
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodedRange}:append?valueInputOption=RAW`;
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ values: rows, majorDimension: 'ROWS' }),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Google Sheets API returned ${response.status}: ${text}`);
	}
}
