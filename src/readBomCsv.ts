export async function readBomCsv(): Promise<string> {
	const bomFile = await eda.pcb_ManufactureData.getBomFile(`ExportBOM-${Date.now()}`, 'csv');
	if (!bomFile) {
		throw new Error('Unable to generate BOM file from the current document.');
	}

	if (typeof bomFile.text === 'function') {
		return bomFile.text();
	}

	return new Response(bomFile).text();
}
