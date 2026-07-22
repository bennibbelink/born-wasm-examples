export function assertFunctionExists(
	f: WebAssembly.ExportValue
): asserts f is (...args: unknown[]) => unknown {
	if (f instanceof Function) {
		return;
	}
	throw new Error(`function does not exist: ${f}`);
}
