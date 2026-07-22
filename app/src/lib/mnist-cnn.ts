const WASM_URL = '/mnist-cnn.wasm';
import { assertFunctionExists } from './utils';

let wasm2: WebAssembly.Instance | null = null;

export const mnistCNNInit = async () => {
	const go = new Go();
	if (!('instantiateStreaming' in WebAssembly)) {
		throw new Error('Streaming not supported');
	}
	const obj = await WebAssembly.instantiateStreaming(
		fetch(WASM_URL),
		go.importObject as WebAssembly.Imports
	);
	wasm2 = obj.instance;
	go.run(wasm2);
};

export const mnistCNNPredict = (
	inputs: number[]
): { predictions: number[]; durationMs: number } => {
	if (!wasm2) {
		throw new Error('Go runtime not initialized. Call mnistCNNInit() first.');
	}
	const { memory, getInputBufPtr, tinygoPredict, getOutputBufPtr, getDurationMs } = wasm2.exports;

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
