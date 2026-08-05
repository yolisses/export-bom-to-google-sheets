export async function loadGoogleIdentityClient(): Promise<void> {
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
