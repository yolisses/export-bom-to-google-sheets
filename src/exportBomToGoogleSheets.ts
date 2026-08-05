import { appendRowsToSheet } from './appendRowsToSheet';
import { getTokenOrClientId } from './getTokenOrClientId';
import { parseCsv } from './parseCsv';
import { readBomCsv } from './readBomCsv';
import { showError } from './showError';
import { showInfo } from './showInfo';
import { showInputDialog } from './showInputDialog';


export async function exportBomToGoogleSheets(): Promise<void> {
	try {
		const spreadsheetId = await showInputDialog(
			'Enter the Google Spreadsheet ID where the BOM should be appended.\n'
			+ 'Example: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
			'Spreadsheet ID'
		);

		if (!spreadsheetId) {
			return;
		}

		const sheetName = (await showInputDialog(
			'Enter the target sheet name in the spreadsheet.',
			'Sheet Name',
			'Sheet1'
		)) || 'Sheet1';

		showInfo('Generating BOM and preparing upload...');

		const bomText = await readBomCsv();
		const rows = parseCsv(bomText);
		if (rows.length === 0) {
			throw new Error('The generated BOM file is empty.');
		}

		const accessToken = await getTokenOrClientId();
		await appendRowsToSheet(spreadsheetId.trim(), sheetName.trim() || 'Sheet1', rows, accessToken.trim());

		showInfo(`Successfully exported BOM to Google Sheets. ${rows.length} row(s) appended.`);
	}
	catch (error) {
		showError(error instanceof Error ? error.message : String(error));
	}
}
