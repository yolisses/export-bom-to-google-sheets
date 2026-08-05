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

	const { Dialog, Input, Modal, Flex } = Components;

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
				height={200}
				width={300}
				left={100}
				top={100}
			>
				<Dialog
					title="Enter values"
					onClose={closeDialog}
					hide={false}
					width={300}
					height={200}
					buttons={[
						{ text: 'Cancel', onClick: closeDialog },
						{ text: 'Ok', onClick: handleOk },
					]}
				>
					<Flex direction="column" gap={10}>
						<Input
							type="text"
							value={text}
							placeholder="Google Sheet URL"
							onChange={(e: any) => setText(e?.target?.value ?? e)}
						/>
						<Input
							type="text"
							placeholder="Sheet Name"
							value={sheetName}
							onChange={(e: any) => setSheetName(e?.target?.value ?? e)}
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
