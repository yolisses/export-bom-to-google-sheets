export function showInputDialog(prompt: string, title: string, defaultValue = ''): Promise<string | undefined> {
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
			}
		);
	});
}
