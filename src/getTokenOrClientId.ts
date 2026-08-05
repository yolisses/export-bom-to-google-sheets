import { requestGoogleAccessToken } from './requestGoogleAccessToken';
import { showInputDialog } from './showInputDialog';

export async function getTokenOrClientId(): Promise<string> {
	const clientId = await showInputDialog(
		'Enter your Google OAuth Client ID. Leave blank to paste an existing access token.',
		'Google OAuth Client ID',
		''
	);

	if (clientId) {
		return requestGoogleAccessToken(clientId);
	}

	const accessToken = await showInputDialog(
		'Enter an existing Google OAuth access token with Sheets write permission.',
		'Google Access Token',
		''
	);

	if (!accessToken) {
		throw new Error('Google access token is required to write to Sheets.');
	}

	return accessToken;
}
