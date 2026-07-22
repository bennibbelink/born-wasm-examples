<script>
	import { resolve } from '$app/paths';
</script>

<div class="min-h-dvh bg-linear-to-br from-go-50 to-go-100 px-4 py-12">
	<div class="mx-auto max-w-3xl">
		<div class="mb-12 text-center">
			<h1 class="text-5xl font-bold tracking-tight text-go-700">Born WASM Examples</h1>
			<p class="mt-4 text-lg text-go-600">
				Machine learning models written in Go and compiled to WebAssembly, running entirely in your
				browser.
			</p>
		</div>

		<div class="mb-12 rounded-2xl border border-go-100 bg-white p-8 shadow-lg shadow-go-200/50">
			<h2 class="mb-4 text-2xl font-semibold text-go-700">What is Born?</h2>
			<p class="leading-relaxed text-go-600">
				<a
					href="https://github.com/born-ml/born"
					class="font-medium text-go-500 underline hover:text-go-700">Born</a
				>
				is a modern deep learning framework written in pure Go.
			</p>
		</div>

		<div class="rounded-2xl border border-go-100 bg-white p-8 shadow-lg shadow-go-200/50">
			<h2 class="mb-6 text-2xl font-semibold text-go-700">Examples</h2>
			<div class="grid gap-6 sm:grid-cols-2">
				<a
					href={resolve('/mnist')}
					class="group rounded-xl border border-go-100 bg-go-50/50 p-6 transition-colors hover:border-go-200 hover:bg-go-100/50"
				>
					<h3 class="text-lg font-semibold text-go-700 group-hover:text-go-800">MNIST</h3>
					<p class="mt-2 text-sm leading-relaxed text-go-600">
						A fully-connected network (~101K params) trained on the MNIST handwritten digit dataset.
						Draw a digit and see predictions in real time.
					</p>
					<div
						class="mt-4 inline-flex items-center gap-1 text-xs font-medium text-go-500 group-hover:text-go-600"
					>
						Try it
						<span class="transition-transform group-hover:translate-x-0.5">&rarr;</span>
					</div>
				</a>
				<a
					href={resolve('/mnist-cnn')}
					class="group rounded-xl border border-go-100 bg-go-50/50 p-6 transition-colors hover:border-go-200 hover:bg-go-100/50"
				>
					<h3 class="text-lg font-semibold text-go-700 group-hover:text-go-800">MNIST-CNN</h3>
					<p class="mt-2 text-sm leading-relaxed text-go-600">
						A LeNet-5 style convolutional network (~62K params) for MNIST. Compare the performance
						of convolutional vs. fully-connected architectures.
					</p>
					<div
						class="mt-4 inline-flex items-center gap-1 text-xs font-medium text-go-500 group-hover:text-go-600"
					>
						Try it
						<span class="transition-transform group-hover:translate-x-0.5">&rarr;</span>
					</div>
				</a>
			</div>
		</div>
	</div>
</div>
