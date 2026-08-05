import React from 'react';
import Reconciler from 'react-reconciler';
import {
  ConcurrentRoot,
  ContinuousEventPriority,
  DefaultEventPriority,
  DiscreteEventPriority,
} from 'react-reconciler/constants';

export async function showTwoInputDialog(): Promise<void> {
	const { Components, WorkerPortal, VirtualRender, LC_DESIGN_COMPONENTS_NAMES }
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

	// Inspect once if you still have issues
	console.log('Available components:', Object.keys(Components));
	console.log('LC_DESIGN_COMPONENTS_NAMES:', LC_DESIGN_COMPONENTS_NAMES);

	const { Modal, Dialog, Input, Button } = Components;

	const portal = new WorkerPortal();
	const root = new VirtualRender();

	function closeDialog() {
		try {
			// Try the most common cleanup paths
			(root as any).unmount?.();
			(root as any).render?.(null);
		}
		catch (e) {
			console.warn('closeDialog failed', e);
		}
	}

	function TwoInputDialog() {
		const [text, setText] = React.useState('');
		const [sheetName, setSheetName] = React.useState('Sheet1');

		const handleOk = () => {
			console.log({ text, sheetName });
			// do your real work here
			closeDialog();
		};

		return (
			<Modal
				defaultTop={120}
				defaultLeft={200}
				defaultWidth={420}
				defaultHeight={320}
				// try common drag / close props
				draggable={true}
				closable={true}
				maskClosable={true}
				onClose={closeDialog}
				onRequestClose={closeDialog}
				onCancel={closeDialog}
			>
				<Dialog title="Enter values">
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 16,
							padding: 16,
						}}
					>
						{/* first field + spacing */}
						<div style={{ marginBottom: 12 }}>
							<div style={{ marginBottom: 6, fontSize: 13 }}>Some text</div>
							<Input
								placeholder="enter some text here"
								value={text}
								onChange={(e: any) => setText(e?.target?.value ?? e)}
							/>
						</div>

						{/* second field + spacing */}
						<div style={{ marginBottom: 20 }}>
							<div style={{ marginBottom: 6, fontSize: 13 }}>Target sheet name</div>
							<Input
								placeholder="Sheet Name"
								value={sheetName}
								onChange={(e: any) => setSheetName(e?.target?.value ?? e)}
							/>
						</div>

						{/* buttons */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'flex-end',
								gap: 8,
								marginTop: 8,
							}}
						>
							{/* try the prop names the host actually accepts */}
							<Button label="Cancel" text="Cancel" title="Cancel" onClick={closeDialog}>
								Cancel
							</Button>
							<Button label="OK" text="OK" title="OK" onClick={handleOk}>
								OK
							</Button>
						</div>
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
