import { getWasmInstanceByUrl, assertFunctionExists } from './wasm';
import WASM_URL from '$lib/assets/mnist.wasm?url';

export { WASM_URL };

export const mnistPredict = (inputs: number[]): { predictions: number[]; durationMs: number } => {
	const wasm = getWasmInstanceByUrl(WASM_URL);
	if (!wasm) {
		throw new Error('Go runtime not initialized. Call wasmInit() first.');
	}
	const { memory, getInputBufPtr, tinygoPredict, getOutputBufPtr, getDurationMs } = wasm.exports;

	const memExport = memory as WebAssembly.Memory;
	const mem = new Float32Array(memExport.buffer);
	assertFunctionExists(getInputBufPtr);
	const inputPtr = getInputBufPtr() as number;

	for (let i = 0; i < 784; i++) {
		mem[(inputPtr >>> 2) + i] = inputs[i];
	}

	assertFunctionExists(tinygoPredict);
	const n = tinygoPredict(784, 10) as number;

	const readMem = new Float32Array(memExport.buffer);
	assertFunctionExists(getOutputBufPtr);
	const outputPtr = getOutputBufPtr() as number;
	const result: number[] = [];
	for (let i = 0; i < n; i++) {
		result.push(readMem[(outputPtr >>> 2) + i]);
	}

	assertFunctionExists(getDurationMs);
	const durationMs = getDurationMs() as number;

	return { predictions: result, durationMs };
};
