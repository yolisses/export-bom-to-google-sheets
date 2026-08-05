import React, { useState } from 'react';
import Reconciler from 'react-reconciler';
import Constants from 'react-reconciler/constants';

export async function showTwoInputDialog(): Promise<void> {
	const { Components, WorkerPortal, VirtualRender }
		= await eda.sys_Dialog.createReactComponentizationDialogInterface(
			React,
			{ default: Reconciler, constants: Constants },
		);

	const { Dialog, Input, Modal, Flex } = Components;

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
			<Modal
				top={120}
				left={200}
				width={380}
				height={260}
				overlay={true}
				// allow dragging (Modal is the draggable shell)
				maxDragX={2000}
				maxDragY={2000}
			>
				<Dialog
					title="Enter values"
					width={380}
					height={260}
					onClose={closeDialog}
					buttons={[
						{ text: 'Cancel', onClick: closeDialog },
						{ text: 'OK', onClick: handleOk },
					]}
				>
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
