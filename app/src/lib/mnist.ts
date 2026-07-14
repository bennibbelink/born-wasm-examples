const WASM_URL = '/mnist.wasm';
import { assertFunctionExists } from './utils';

let wasm: WebAssembly.Instance | null = null;

export const mnistInit = async () => {
	const go = new Go();
	if (!('instantiateStreaming' in WebAssembly)) {
		throw new Error('Streaming not supported');
	}
	const obj = await WebAssembly.instantiateStreaming(
		fetch(WASM_URL),
		go.importObject as WebAssembly.Imports
	);
	wasm = obj.instance;
	go.run(wasm);
};

export const mnistParamCount = () => {
	if (!wasm) {
		throw new Error('Go runtime not initialized. Call mnistInit() first.');
	}
	const { memory, getMetricsBufPtr } = wasm.exports;

	const memExport = memory as WebAssembly.Memory;
	const metricsMem = new Int32Array(memExport.buffer);
	assertFunctionExists(getMetricsBufPtr);
	const metricsPtr = getMetricsBufPtr() as number;
	const paramCount = metricsMem[(metricsPtr >>> 2) + 1];
	return paramCount;
};

export const mnistPredict = (inputs: number[]): { predictions: number[]; durationMs: number } => {
	if (!wasm) {
		throw new Error('Go runtime not initialized. Call mnistInit() first.');
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
