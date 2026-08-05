import { GOOGLE_SHEETS_SCOPE } from './GOOGLE_SHEETS_SCOPE';
import { loadGoogleIdentityClient } from './loadGoogleIdentityClient';

export async function requestGoogleAccessToken(clientId: string): Promise<string> {
	await loadGoogleIdentityClient();

	if (!window.google?.accounts?.oauth2?.initTokenClient) {
		throw new Error('Google Identity Services client is unavailable.');
	}

	return new Promise((resolve, reject) => {
		const tokenClient = window.google.accounts.oauth2.initTokenClient({
			client_id: clientId,
			scope: GOOGLE_SHEETS_SCOPE,
			callback: (tokenResponse: { access_token?: string; error?: string; error_description?: string; }) => {
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
