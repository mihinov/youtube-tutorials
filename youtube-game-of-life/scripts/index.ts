import { GameOfLife } from "./game-of-life";

const canvasNode = document.querySelector<HTMLCanvasElement>('.canvas');
const popupNode = document.querySelector<HTMLElement>('.popup');

if (canvasNode === null || popupNode === null) {
	throw new Error('canvas не найден');
}

const game = new GameOfLife({
	canvasNode: canvasNode,
	cellsCountX: 10,
	cellsCountY: 10,
	popupNode: popupNode,
	random: false,
	speed: 1,
	localStorageUse: true
});

(window as any).game = game;

const worker = new Worker(new URL('workers/worker-init-fields.js', import.meta.url));

worker.postMessage({
	type: 'start',
	payload: {
		color: 'red'
	}
});

worker.onmessage = (event) => {
  const message = event.data;
	console.log(message);

  if (message.type === 'result') {
    // обрабатываем результаты расчетов
  }
};

worker.postMessage({
	type: 'start',
	payload: {
		color: 'white'
	}
});

