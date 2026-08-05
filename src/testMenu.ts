import { TestComponent } from './testComponent';

function handleSheet(value: string) {
	console.log(value);
	eda.sys_Dialog.createReactComponentizationDialogInterface({
		createElement: () => TestComponent(),
	}, {});
	eda.sys_Message.showToastMessage(value);
}

function handleUrl(value: string) {
	console.log(value);
	eda.sys_Dialog.showInputDialog(
		'Enter the spread sheet URL',
		undefined,
		'Export BOM to Google Sheets',
		'url',
		undefined,
		undefined,
		handleSheet,
	);
}

export async function testMenu(): Promise<void> {
	eda.sys_Dialog.showInputDialog(
		'Enter the spread sheet URL',
		undefined,
		'Export BOM to Google Sheets',
		'url',
		undefined,
		undefined,
		handleUrl,
	);
}
