import React, { Fragment } from 'react';

export function GoogleAuthButton() {
	// TODO set document.handleGoogleSignIn
	return (
		<Fragment>
			<div
				id="g_id_onload"
				data-client_id="47676842563-q0ptemrqjnu7njnnv4d8pck1omt51uu6.apps.googleusercontent.com"
				data-context="signin"
				data-ux_mode="popup"
				data-callback="handleGoogleSignIn"
				data-auto_prompt="false"
			>
			</div>
			<div
				className="g_id_signin"
				data-type="standard"
				data-shape="rectangular"
				data-theme="outline"
				data-text="signin_with"
				data-size="large"
				data-logo_alignment="left"
			>
			</div>
		</Fragment>
	);
}
