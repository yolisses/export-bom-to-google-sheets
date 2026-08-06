export async function openIframe() {
	const a = await eda.sys_ClientUrl.request('https://export-easyeda-bom-to-google-sheets.vercel.app/test1', 'POST', JSON.stringify({ test1: 'nice' }));
	console.log(a);
	console.log('openIframe');
	// eda.sys_IFrame.openIFrame('/iframe/google-sign-in.html', 500, 500);
	eda.sys_IFrame.openIFrame('/iframe/test1.html', 500, 500);
	// eda.sys_IFrame.openIFrame('https://lispm.site', 500, 500);
}
