const wasmInstances: Record<string, WebAssembly.Instance> = {};

function assertGoAvailable(): void {
	if (typeof Go === 'undefined') {
		throw new Error(
			'Go runtime not loaded. Ensure wasm_exec.js is included before calling wasmInit().'
		);
	}
}

export const wasmInit = async (wasmUrl: string) => {
	assertGoAvailable();
	const go = new Go();
	let obj;
	if ('instantiateStreaming' in WebAssembly) {
		obj = await WebAssembly.instantiateStreaming(
			fetch(wasmUrl),
			go.importObject as WebAssembly.Imports
		);
	} else {
		const src = await fetch(wasmUrl);
		obj = WebAssembly.instantiate(src, go.importObject as WebAssembly.Imports);
	}
	wasmInstances[wasmUrl] = obj.instance;
	go.run(wasmInstances[wasmUrl]);
};

export function getWasmInstanceByUrl(wasmUrl: string): WebAssembly.Instance | null {
	return wasmInstances[wasmUrl];
}

export function assertFunctionExists(
	f: WebAssembly.ExportValue
): asserts f is (...args: unknown[]) => unknown {
	if (f instanceof Function) {
		return;
	}
	throw new Error(`function does not exist: ${f}`);
}
