<script lang="ts">
	import * as d3 from 'd3';

	interface BarChartDatum {
		label: string;
		value: number;
	}

	let {
		data = Array.from({ length: 10 }, (_, i) => ({ label: i.toString(), value: 0 }))
	}: {
		data: BarChartDatum[];
	} = $props();

	let container: HTMLDivElement;
	let svgEl: SVGSVGElement;
	let containerWidth = $state(400);

	$effect(() => {
		const maxVal = Math.max(d3.max(data, (d) => d.value) ?? 0, 1);
		const margin = { top: 20, right: 20, bottom: 30, left: 40 };
		const w = containerWidth - margin.left - margin.right;
		const h = 280 - margin.top - margin.bottom;

		const svg = d3.select(svgEl);

		const x = d3
			.scaleBand()
			.domain(data.map((d) => d.label))
			.range([0, w])
			.padding(0.2);

		const y = d3.scaleLinear().domain([0, maxVal]).range([h, 0]);

		let g = svg.select<SVGGElement>('g.chart-content');
		if (g.empty()) {
			g = svg
				.append('g')
				.attr('class', 'chart-content')
				.attr('transform', `translate(${margin.left},${margin.top})`);
		}

		g.selectAll('.axis').remove();

		g.append('g').attr('class', 'axis').call(d3.axisLeft(y).ticks(10));
		g.append('g')
			.attr('class', 'axis')
			.attr('transform', `translate(0,${h})`)
			.call(d3.axisBottom(x));
		g.selectAll('.axis path, .axis line').remove();

		const t = d3.transition().duration(400);

		g.selectAll<SVGRectElement, BarChartDatum>('rect')
			.data(data, (d) => d.label)
			.join(
				(enter) =>
					enter
						.append('rect')
						.attr('x', (d) => x(d.label)!)
						.attr('y', h)
						.attr('width', x.bandwidth())
						.attr('height', 0)
						.attr('fill', '#3da0c4')
						.attr('rx', 2)
						.call((el) =>
							el
								.transition(t)
								.attr('y', (d) => y(d.value))
								.attr('height', (d) => h - y(d.value))
						),
				(update) =>
					update.call((el) =>
						el
							.transition(t)
							.attr('x', (d) => x(d.label)!)
							.attr('y', (d) => y(d.value))
							.attr('width', x.bandwidth())
							.attr('height', (d) => h - y(d.value))
					),
				(exit) => exit.call((el) => el.transition(t).attr('y', h).attr('height', 0).remove())
			);

		g.selectAll<SVGTextElement, BarChartDatum>('text.bar-label')
			.data(data, (d) => d.label)
			.join(
				(enter) =>
					enter
						.append('text')
						.attr('class', 'bar-label')
						.attr('x', (d) => x(d.label)! + x.bandwidth() / 2)
						.attr('y', h)
						.attr('text-anchor', 'middle')
						.attr('fill', '#000')
						.attr('font-size', '11px')
						.attr('font-weight', '600')
						.attr('pointer-events', 'none')
						.call((el) =>
							el
								.transition(t)
								.attr('y', (d) => y(d.value) + (h - y(d.value)) / 2 + 4)
								.text((d) => d.value.toFixed(2))
						),
				(update) =>
					update.call((el) =>
						el
							.transition(t)
							.attr('x', (d) => x(d.label)! + x.bandwidth() / 2)
							.attr('y', (d) => y(d.value) + (h - y(d.value)) / 2 + 4)
							.text((d) => d.value.toFixed(2))
					),
				(exit) => exit.call((el) => el.remove())
			);
	});

	$effect(() => {
		if (!container) return;
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				containerWidth = entry.contentRect.width;
			}
		});
		observer.observe(container);
		return () => observer.disconnect();
	});
</script>

<div bind:this={container} class="bar-chart">
	<svg bind:this={svgEl} width={containerWidth} height="280"></svg>
</div>

<style>
	.bar-chart {
		width: 100%;
	}
</style>
