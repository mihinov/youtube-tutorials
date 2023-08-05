import { Ring } from "./base-ring";

const canvasNode = document.querySelector<HTMLCanvasElement>('.canvas');
const paintNode = document.querySelector<HTMLDivElement>('.paint');

const renderBaseRing = (canvasNode: HTMLCanvasElement | null) => {

	if (canvasNode === null) {
		return;
	}

	canvasNode?.classList.remove('_hidden');

	const ring = new Ring({
		canvas: canvasNode,
		color1: 'white',
		percent1: 70,
		color2: 'yellow',
		percent2: 30
	});

	ring.animUpdatePercent({percent1: 20, percent2: 80, color1: 'red', delay: 1})
		.add(ring.animUpdatePercent({percent1: 80, percent2: 20, color2: 'green'}))
		.add(ring.animUpdatePercent({percent1: 30, percent2: 70, color1: 'pink'}));

	(window as any).ring = ring;
};

const renderPaintNode = () => {
	paintNode?.classList.remove('_hidden');
	CSS.paintWorklet.addModule(new URL("worklet-ring.ts", import.meta.url));
};

renderPaintNode();
renderBaseRing(canvasNode);
