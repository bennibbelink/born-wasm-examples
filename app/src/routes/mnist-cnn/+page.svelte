<script lang="ts">
	import MNISTBarChart from '$lib/MNISTBarChart.svelte';
	import MNISTCanvas from '$lib/MNISTCanvas.svelte';
	import { mnistCNNInit, mnistCNNPredict } from '$lib/mnist-cnn';
	import { SOURCE_URLS } from '$lib/config';
	import { onMount } from 'svelte';

	let resultTensor: number[] | undefined = $state(Array(10).fill(0));
	let duration: number | undefined = $state();

	onMount(async () => {
		await mnistCNNInit();
	});

	function onPredict(inputs: number[]) {
		const { predictions, durationMs } = mnistCNNPredict(inputs);
		requestAnimationFrame(() => {
			resultTensor = predictions;
			duration = durationMs;
		});
	}

	function onClear() {
		requestAnimationFrame(() => {
			resultTensor = [];
			duration = undefined;
		});
	}
</script>

<div class="min-h-dvh bg-linear-to-br from-go-50 to-go-100 py-8 px-4">
	<div class="max-w-4xl mx-auto">
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-go-700 tracking-tight">MNIST-CNN</h1>
			<div class="mt-2 flex justify-center">
				<span
					class="inline-flex items-center rounded-full bg-go-100 px-3 py-1 text-xs font-medium text-go-700 ring-1 ring-go-700"
				>
					Running entirely in your browser via WebAssembly
				</span>
			</div>
		</div>

		<div class=" bg-white rounded-2xl shadow-lg shadow-go-200/50 border border-go-100 p-6 md:p-8">
			<div class="flex flex-col md:flex-row gap-8 items-start justify-center">
				<div class="shrink-0">
					<MNISTCanvas {onPredict} {onClear}></MNISTCanvas>
				</div>
				<div class="flex flex-col items-center gap-2 min-w-0 flex-1">
					<p class="text-xs font-semibold text-go-600 uppercase tracking-wider">Prediction</p>
					<div class="w-full">
						<MNISTBarChart
							data={(resultTensor ?? []).map((v, i) => ({ label: String(i), value: v }))}
						></MNISTBarChart>
					</div>
					<p class="text-xs text-go-400 h-4 {duration !== undefined ? '' : 'invisible'}">
						{duration ?? 0} ms
					</p>
					<p class="text-xs text-go-400">
						Source code for this example can be found <a
							href={SOURCE_URLS['mnist-cnn']}
							class="font-medium text-go-500 underline hover:text-go-700"
							target="_blank"
							rel="external">here</a
						>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
