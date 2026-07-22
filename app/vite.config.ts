import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	assetsInclude: ['**/*.wasm', 'src/lib/assets/wasm_exec.js'],
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: undefined,
				precompress: true,
				strict: true
			}),

			paths: {
				base: (process.argv.includes('dev') ? '' : process.env.BASE_PATH) as
					'' | `/${string}` | undefined
			}
		})
	],

	build: {
		cssMinify: true,
		sourcemap: false,
		target: 'es2020'
	}
});
