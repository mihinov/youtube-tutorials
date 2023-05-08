import { GameOfLife } from "./game-of-life";

const injectedNode = document.querySelector<HTMLElement>('.injected-game-life');

if (injectedNode === null) {
	throw new Error('injectedNode не найден');
}

const game = new GameOfLife({
	cellsCountX: 100,
	cellsCountY: 100,
	random: false,
	speed: 1,
	localStorageUse: true,
	popupHidden: false,
	injectedNode: injectedNode
});
