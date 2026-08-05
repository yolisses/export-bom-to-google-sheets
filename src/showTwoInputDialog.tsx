import React from 'react';
// You also need react-reconciler and its constants
import Reconciler from 'react-reconciler';
import {
	ConcurrentRoot,
	ContinuousEventPriority,
	DefaultEventPriority,
	DiscreteEventPriority,
} from 'react-reconciler/constants';

export async function showTwoInputDialog(): Promise<void> {
	const { Components, WorkerPortal, VirtualRender }
		= await eda.sys_Dialog.createReactComponentizationDialogInterface(
			{
				createContext: React.createContext,
				useContext: React.useContext,
				useRef: React.useRef,
				useEffect: React.useEffect,
				createElement: React.createElement,
			},
			{
				default: Reconciler,
				constants: {
					ContinuousEventPriority,
					DiscreteEventPriority,
					DefaultEventPriority,
					ConcurrentRoot,
				},
			},
		);

	const { Modal, Dialog, Input, Button } = Components;

	const portal = new WorkerPortal();
	const root = new VirtualRender();

	function TwoInputDialog() {
		// Controlled inputs (typical pattern)
		const [text, setText] = React.useState('');
		const [sheetName, setSheetName] = React.useState('Sheet1');

		const handleOk = () => {
			// TODO: do something with text + sheetName
			console.log({ text, sheetName });
			// How to close the dialog is not fully documented yet.
			// Common patterns people try:
			// - portal / root unmount helpers if exposed
			// - or simply let the user close via the built-in close button
		};

		return (
			<Modal
				defaultTop={120}
				defaultLeft={200}
				defaultWidth={420}
				defaultHeight={280}
			>
				<Dialog title="Enter values">
					<div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 8 }}>
						<label>
							Some text
							<Input
								placeholder="enter some text here"
								value={text}
								onChange={(e: any) => setText(e?.target?.value ?? e)}
							/>
						</label>

						<label>
							Target sheet name
							<Input
								placeholder="Sheet Name"
								value={sheetName}
								onChange={(e: any) => setSheetName(e?.target?.value ?? e)}
							/>
						</label>

						{/* If a Button component exists in Components: */}
						<Button onClick={handleOk}>OK</Button>
					</div>
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
