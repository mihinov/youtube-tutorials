import { GameOfLife } from "./game-of-life";

const canvasNode = document.querySelector<HTMLCanvasElement>('.canvas');
const popupNode = document.querySelector<HTMLElement>('.popup');

if (canvasNode === null || popupNode === null) {
	throw new Error('canvas не найден');
}

const game = new GameOfLife({
	canvasNode: canvasNode,
	cellsCountX: 100,
	cellsCountY: 100,
	popupNode: popupNode,
	random: false,
	speed: 1,
	localStorageUse: true,
	popupHidden: false
});

(window as any).game = game;
