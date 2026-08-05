/**
 * 入口文件 / Entry File
 *
 * 本文件为默认扩展入口文件，如果你想要配置其它文件作为入口文件，
 * 请修改 `extension.json` 中的 `entry` 字段。
 * This is the default extension entry file. If you want to use another file as the entry,
 * please modify the `entry` field in `extension.json`.
 *
 * 请在此处使用 `export`  导出所有你希望在 `headerMenus` 中引用的方法，
 * 方法通过方法名与 `headerMenus` 关联。
 * Please use `export` here to export all methods you want to reference in `headerMenus`.
 * Methods are associated with `headerMenus` by their method names.
 *
 * 如需了解更多开发细节，请阅读：
 * https://prodocs.lceda.cn/cn/api/guide/
 * For more development details, please visit:
 * https://prodocs.easyeda.com/en/api/guide/
 */
import extensionConfig from '../extension.json' with { type: 'json' };

declare global {
	interface Window {
		google?: any;
	}
}

const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

function showInfo(content: string, title = 'Export BOM to Google Sheets'): void {
	eda.sys_Dialog.showInformationMessage(content, title);
}

function showError(message: string): void {
	eda.sys_Dialog.showInformationMessage(`Error: ${message}`, 'Export BOM to Google Sheets');
}

function showInputDialog(prompt: string, title: string, defaultValue = ''): Promise<string | undefined> {
	return new Promise((resolve) => {
		eda.sys_Dialog.showInputDialog(
			prompt,
			undefined,
			title,
			'text',
			defaultValue,
			undefined,
			(value) => {
				if (typeof value === 'string') {
					resolve(value.trim());
				}
				else {
					resolve(undefined);
				}
			},
		);
	});
}

function parseCsv(text: string): Array<Array<string>> {
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

async function loadGoogleIdentityClient(): Promise<void> {
	if (typeof window === 'undefined' || window.google?.accounts?.oauth2?.initTokenClient) {
		return;
	}

	if (!document || !document.head) {
		throw new Error('Google Identity Services requires a browser document.');
	}

	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.async = true;
		script.defer = true;
		script.onload = () => {
			resolve();
		};
		script.onerror = () => {
			reject(new Error('Unable to load Google Identity Services.'));
		};
		document.head.appendChild(script);
	});
}

async function requestGoogleAccessToken(clientId: string): Promise<string> {
	await loadGoogleIdentityClient();

	if (!window.google?.accounts?.oauth2?.initTokenClient) {
		throw new Error('Google Identity Services client is unavailable.');
	}

	return new Promise((resolve, reject) => {
		const tokenClient = window.google.accounts.oauth2.initTokenClient({
			client_id: clientId,
			scope: GOOGLE_SHEETS_SCOPE,
			callback: (tokenResponse: { access_token?: string; error?: string; error_description?: string }) => {
				if (tokenResponse.error) {
					reject(new Error(tokenResponse.error_description || tokenResponse.error));
					return;
				}

				if (!tokenResponse.access_token) {
					reject(new Error('Google access token was not returned.'));
					return;
				}

				resolve(tokenResponse.access_token);
			},
		});

		tokenClient.requestAccessToken({ prompt: 'consent' });
	});
}

async function appendRowsToSheet(
	spreadsheetId: string,
	sheetName: string,
	rows: Array<Array<string>>,
	accessToken: string,
): Promise<void> {
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

async function readBomCsv(): Promise<string> {
	const bomFile = await eda.pcb_ManufactureData.getBomFile(`ExportBOM-${Date.now()}`, 'csv');
	if (!bomFile) {
		throw new Error('Unable to generate BOM file from the current document.');
	}

	if (typeof bomFile.text === 'function') {
		return bomFile.text();
	}

	return new Response(bomFile).text();
}

async function getTokenOrClientId(): Promise<string> {
	const clientId = await showInputDialog(
		'Enter your Google OAuth Client ID. Leave blank to paste an existing access token.',
		'Google OAuth Client ID',
		'',
	);

	if (clientId) {
		return requestGoogleAccessToken(clientId);
	}

	const accessToken = await showInputDialog(
		'Enter an existing Google OAuth access token with Sheets write permission.',
		'Google Access Token',
		'',
	);

	if (!accessToken) {
		throw new Error('Google access token is required to write to Sheets.');
	}

	return accessToken;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export function activate(status?: 'onStartupFinished', arg?: string): void {}

export async function exportBomToGoogleSheets(): Promise<void> {
	try {
		const spreadsheetId = await showInputDialog(
			'Enter the Google Spreadsheet ID where the BOM should be appended.\n'
			+ 'Example: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
			'Spreadsheet ID',
		);

		if (!spreadsheetId) {
			return;
		}

		const sheetName = (await showInputDialog(
			'Enter the target sheet name in the spreadsheet.',
			'Sheet Name',
			'Sheet1',
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

export function about(): void {
	eda.sys_Dialog.showInformationMessage(
		eda.sys_I18n.text(
			'EasyEDA extension SDK v',
			undefined,
			undefined,
			extensionConfig.version,
		),
		eda.sys_I18n.text('About'),
	);
}
