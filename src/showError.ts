export function showError(message: string): void {
	eda.sys_Dialog.showInformationMessage(`Error: ${message}`, 'Export BOM to Google Sheets');
}
