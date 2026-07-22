import { browser } from '$app/environment';
import WASM_EXEC_URL from '$lib/assets/wasm_exec.js?url';

export const prerender = true;
export const ssr = false;

export async function load() {
	if (browser) {
		await new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = WASM_EXEC_URL;
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}
	return {};
}
