import extensionConfig from '../extension.json' with { type: 'json' };

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
