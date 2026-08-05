import React, { useState } from 'react';
import Reconciler from 'react-reconciler';
import Constants from 'react-reconciler/constants';

export async function TestGoogleSignIn(): Promise<void> {
	try {
		const { Components, WorkerPortal, VirtualRender }
			= await eda.sys_Dialog.createReactComponentizationDialogInterface(
				React,
				{ default: Reconciler, constants: Constants },
			);

		const { Dialog, Input, Modal, Flex, Button } = Components;
		console.log(Components);

		const portal = new WorkerPortal();
		const root = new VirtualRender();

		function closeDialog() {
			try {
				root.render(null as any);
			}
			catch (e) {
				console.warn('closeDialog failed', e);
			}
		}

		function TwoInputDialog() {
			const [text, setText] = useState('');
			const [sheetName, setSheetName] = useState('Sheet1');

			const handleOk = () => {
				console.log({ text, sheetName });
				// your real work here
				closeDialog();
			};

			return (
			// There's a bug that breaks the focus when some position
			// or size prop is provided.
			// Tested in 2026-08-05
				<Modal>
					<Dialog
						title="Enter values"
						onClose={closeDialog}
						buttons={[
							{ text: 'Cancel', onClick: closeDialog },
							{ text: 'OK', onClick: handleOk },
						]}
					>
						<Button
							text="open iframe"
							onClick={() => {
								eda.sys_IFrame.openIFrame('/iframe/index.html', 500, 500);
							}}
						/>
						<Flex direction="column" gap={12} padding={[12]}>
							<Input
								type="text"
								placeholder="Google Sheet URL"
								value={text}
								onChange={setText}
							/>
							<Input
								type="text"
								placeholder="Sheet Name"
								value={sheetName}
								onChange={setSheetName}
							/>
						</Flex>
					</Dialog>
				</Modal>
			);
		}

		root.render(
			<portal.Provider>
				<TwoInputDialog />
			</portal.Provider>,
		);
	}
	catch (e) {
		console.error(e);
	}
}
