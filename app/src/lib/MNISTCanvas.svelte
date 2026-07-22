<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas, PencilBrush } from 'fabric';
	type CanvasProps = {
		triggerDelay?: number;
		onPredict: (inputs: number[]) => void;
		onClear: () => void;
	};
	const { triggerDelay = 300, onPredict, onClear }: CanvasProps = $props();

	let canvas: Canvas;

	onMount(() => {
		canvas = new Canvas('mnist-canvas', {
			isDrawingMode: true
		});

		canvas.backgroundColor = 'rgba(255, 255, 255, 255)';
		canvas.freeDrawingBrush = new PencilBrush(canvas);
		canvas.freeDrawingBrush.width = 25;
		const clearEl = document.getElementById('clear-canvas');

		if (clearEl) {
			clearEl.onclick = function () {
				canvas.clear();
				canvas.backgroundColor = 'rgba(255, 255, 255, 255)';
				canvas.renderAll();
				const scaledCanvas = document.getElementById('scaled-canvas') as HTMLCanvasElement;
				if (scaledCanvas) {
					const ctx = scaledCanvas.getContext('2d');
					if (ctx) {
						ctx.fillStyle = 'white';
						ctx.fillRect(0, 0, 28, 28);
					}
				}
				onClear();
			};
		}

		let drawTimer: ReturnType<typeof setTimeout> | undefined;
		let mouseDown: boolean = false;

		canvas.on('mouse:move', () => {
			if (!drawTimer && mouseDown) {
				drawTimer = setTimeout(() => {
					drawTimer = undefined;
					predict();
				}, triggerDelay);
			}
		});

		canvas.on('mouse:down', () => {
			mouseDown = true;
		});

		canvas.on('mouse:up', () => {
			mouseDown = false;
			if (drawTimer) {
				clearTimeout(drawTimer);
				drawTimer = undefined;
			}
			predict();
		});
	});

	function cropImageFromCanvas(ctx: CanvasRenderingContext2D) {
		const cvs = ctx.canvas;
		let w = cvs.width;
		let h = cvs.height;
		const pix = { x: [] as number[], y: [] as number[] };
		const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				const index = (y * w + x) * 4;
				const r = imageData.data[index];
				const g = imageData.data[index + 1];
				const b = imageData.data[index + 2];
				if (Math.min(r, g, b) < 240) {
					pix.x.push(x);
					pix.y.push(y);
				}
			}
		}
		pix.x.sort((a, b) => a - b);
		pix.y.sort((a, b) => a - b);
		const n = pix.x.length - 1;
		if (n < 0) return [28, 28, ctx.getImageData(0, 0, 28, 28)] as const;
		w = 1 + pix.x[n] - pix.x[0];
		h = 1 + pix.y[n] - pix.y[0];
		const cropped = ctx.getImageData(pix.x[0], pix.y[0], w, h);
		return [w, h, cropped] as const;
	}

	function rgba2gray(data: Uint8ClampedArray) {
		const converted = new Float32Array(data.length / 4);
		for (let i = 0; i < data.length; i += 4) {
			const r = 255 - data[i];
			const g = 255 - data[i + 1];
			const b = 255 - data[i + 2];
			const y = 0.299 * r + 0.587 * g + 0.114 * b;
			converted[i / 4] = y / 255;
		}
		return converted;
	}

	function getMergedCtx() {
		const w = canvas.lowerCanvasEl.width;
		const h = canvas.lowerCanvasEl.height;
		const lowerCtx = canvas.lowerCanvasEl.getContext('2d')!;
		const upperData = canvas.upperCanvasEl.getContext('2d')!.getImageData(0, 0, w, h);
		const merged = lowerCtx.getImageData(0, 0, w, h);
		const upx = upperData.data;
		const mpx = merged.data;
		for (let i = 0; i < upx.length; i += 4) {
			if (upx[i + 3] > 0) {
				mpx[i] = upx[i];
				mpx[i + 1] = upx[i + 1];
				mpx[i + 2] = upx[i + 2];
				mpx[i + 3] = 255;
			}
		}
		const tmp = document.createElement('canvas');
		tmp.width = w;
		tmp.height = h;
		const ctx = tmp.getContext('2d')!;
		ctx.putImageData(merged, 0, 0);
		return ctx;
	}

	function predict() {
		if (!canvas) {
			console.error('Canvas not initialized');
			return;
		}

		canvas.renderAll();
		const mainCtx = getMergedCtx();

		const cropCanvas = document.createElement('canvas');
		const scaledCanvas = document.createElement('canvas');
		scaledCanvas.width = 28;
		scaledCanvas.height = 28;
		const cropCtx = cropCanvas.getContext('2d')!;
		const scaledCtx = scaledCanvas.getContext('2d')!;

		const [w, h, croppedImage] = cropImageFromCanvas(mainCtx);
		const size = Math.max(w, h) * 1.2;
		cropCanvas.width = size;
		cropCanvas.height = size;

		cropCtx.fillStyle = 'white';
		cropCtx.fillRect(0, 0, size, size);
		const leftPadding = (size - w) / 2;
		const topPadding = (size - h) / 2;
		cropCtx.putImageData(croppedImage, leftPadding, topPadding);

		scaledCtx.fillStyle = 'white';
		scaledCtx.fillRect(0, 0, 28, 28);
		scaledCtx.scale(28 / cropCanvas.width, 28 / cropCanvas.height);
		scaledCtx.drawImage(cropCanvas, 0, 0);

		const preview = document.getElementById('scaled-canvas') as HTMLCanvasElement;
		if (preview) {
			const previewCtx = preview.getContext('2d');
			if (previewCtx) {
				previewCtx.drawImage(scaledCanvas, 0, 0);
			}
		}

		const rawData = scaledCtx.getImageData(0, 0, 28, 28).data;
		const tensor = rgba2gray(rawData);
		onPredict(Array.from(tensor));
	}
</script>

<div class="flex flex-col items-center gap-2">
	<p class="text-xs font-semibold text-go-600 uppercase tracking-wider">Draw here</p>
	<canvas
		width={400}
		height={400}
		id="mnist-canvas"
		class="rounded-xl border-2 border-go-200 shadow-inner cursor-crosshair"
	></canvas>
	<div class="flex items-center w-75">
		<div class="flex-1 flex justify-center">
			<button
				id="clear-canvas"
				class="inline-flex items-center gap-1.5 px-5 py-2 bg-go-600 hover:bg-go-700 text-white font-medium rounded-lg transition-colors duration-150 cursor-pointer"
			>
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/>
				</svg>
				Clear
			</button>
		</div>
		<div class="flex flex-col items-center gap-1">
			<canvas
				width={28}
				height={28}
				id="scaled-canvas"
				class="rounded-lg border-2 border-go-200 w-25 h-25"
				style="image-rendering: pixelated"
			></canvas>
			<p class="text-xs text-go-500">28&times;28 input</p>
		</div>
	</div>
</div>
