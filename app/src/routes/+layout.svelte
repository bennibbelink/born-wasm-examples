<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="sticky top-0 z-50 border-b border-go-100 bg-white/80 backdrop-blur-sm">
	<div class="mx-auto flex h-14 max-w-4xl items-center gap-1 px-4">
		<a
			href={resolve('/')}
			class="rounded-lg px-3 py-2 text-sm font-medium transition-colors
				{page.url.pathname === '/'
				? 'bg-go-100 text-go-700'
				: 'text-go-600 hover:bg-go-50 hover:text-go-700'}"
		>
			Home
		</a>
		<a
			href={resolve('/mnist')}
			class="rounded-lg px-3 py-2 text-sm font-medium transition-colors
				{page.url.pathname === '/mnist'
				? 'bg-go-100 text-go-700'
				: 'text-go-600 hover:bg-go-50 hover:text-go-700'}"
		>
			MNIST
		</a>
		<a
			href={resolve('/mnist-cnn')}
			class="rounded-lg px-3 py-2 text-sm font-medium transition-colors
				{page.url.pathname === '/mnist-cnn'
				? 'bg-go-100 text-go-700'
				: 'text-go-600 hover:bg-go-50 hover:text-go-700'}"
		>
			MNIST-CNN
		</a>
	</div>
</nav>

{@render children()}
