import { GameOfLifeLocalStorage, GameOfLifeNodes, GameOfLifeParams } from "../interfacesOrTypes";
import { debounce } from "./functions/debounce";
import { requestInterval } from "./functions/request-interval";

export class GameOfLife {
	private ctx: CanvasRenderingContext2D;
	private rows: number;
	private cols: number;
	private cellSize: number;
	private field: Map<string, boolean>;
	private buffer: Map<string, boolean>;
	private colorCell: string;
	private animationObj: { id: number };
	private nodes: GameOfLifeNodes;
	private cycles: number = 0;
	private played: boolean = false;
	private interval: number = 500;
	private gameTime: number = 0;
	private gameStartTime: number = 0;
	private gameLastTime: number = 0;
	private random: boolean = false;
	private speed: number = 0;
	private activeCells: number = 0;
	private localStorageUse: boolean = false;
	private isDragging: boolean = false;
	private isRealDragging: boolean = false;
	private animationTimeId: { id: number };

	constructor({ canvasNode, popupNode, cellsCountX, cellsCountY, random, speed, localStorageUse }: GameOfLifeParams) {
		if (speed < 1) {
			throw new Error('GameOfLife: speed не может быть меньше 1');
		}
		if (speed > 10) {
			throw new Error('GameOfLife: speed не может быть больше 10');
		}

		this.ctx = canvasNode.getContext("2d")!;
		this.rows = cellsCountX;
		this.cols = cellsCountY;
		this.random = random;
		this.speed = speed;
		this.localStorageUse = localStorageUse;

		this.initNodes(canvasNode, popupNode);
		if (this.localStorageUse) this.useLocalStorage();
		this.initCalcSpeed();
		this.setCanvasSize();
		this.setColorCell();
		this.initFields();
		this.initEventListeners();
		this.drawField();
		this.renderPopup();
	}

	private initEventListeners(): void {
		window.addEventListener('resize', this.resizeAndDraw);
		const matchMediaDark = window.matchMedia('(prefers-color-scheme: dark)');

		matchMediaDark.addEventListener('change', this.setColorCellAndDraw);

		this.nodes.popupPauseNode.addEventListener('click', () => {
			if (this.played === false) {
				return;
			}
			this.stopGame();
		});

		this.nodes.popupPlayNode.addEventListener('click', () => {
			if (this.played === true) {
				return;
			}
			this.startGame();
		});

		// this.nodes.popupRestartNode.addEventListener('click', this.reStart);
		this.nodes.popupGenerateNode.addEventListener('click', this.generateNewFields);

		// this.nodes.canvasNode.addEventListener('click', (event) => {
		// 	// this.lastIsDragging = this.isDragging;
		// 	// this.isDragging = false;
		// 	this.generateCellByClick(event, false);
		// });

		this.nodes.canvasNode.addEventListener('pointerdown', (event) => {
			this.isDragging = true;
			this.isRealDragging = false;
		});

		this.nodes.canvasNode.addEventListener('pointermove', (event) => {
			if (this.isDragging === true) {
				this.isRealDragging = true;
				this.generateCellByClick(event, true)
			};
		});

		document.addEventListener('pointerup', (event) => {
			if (this.isRealDragging === false) this.generateCellByClick(event, false);

			this.isDragging = false;
			this.isRealDragging = false;
		});

		// document.addEventListener('pointerup', (event) => {
		// 	// if (this.isRealDragging === false) this.generateCellByClick(event, false);
		// 	// this.isDragging = false;
		// 	// this.isRealDragging = false;

		// 	this.isDragging = false;
		// 	if (this.isRealDragging === false) {
		// 		setTimeout(() => {
		// 			if (this.isRealDragging === false) {
		// 				this.generateCellByClick(event, false);
		// 				this.isRealDragging = false;
		// 			}
		// 		}, 20);
		// 	} else {
		// 		this.isRealDragging = false;
		// 	}

		// });

		this.nodes.popupRandomCheckboxNode.addEventListener('input', () => {
			this.random = !this.random;
			if (this.localStorageUse) this.setLocalStorage('random', this.random);
			this.renderRandom();
		});

		this.nodes.popupSpeedRangeNode.addEventListener('input', this.calcSpeedInputChange);
		this.nodes.popupClearNode.addEventListener('click', this.clear);

		this.nodes.popupStepNode.addEventListener('click', this.stepGame);
	}

	private generateCellByClick = (event: MouseEvent, moved: boolean = false): void => {
		if (this.played === true) {
			return;
		}
		const rect = this.nodes.canvasNode.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const col = Math.floor(x / this.cellSize);
		const row = Math.floor(y / this.cellSize);
		const key = this.getKey(row, col);

		const isCellAlive = this.field.get(key);

		const deleteCell = () => {
			this.activeCells--;
			this.field.set(key, false);
		};

		const createCell = () => {
			this.activeCells++;
			this.field.set(key, true);
		}

		if (isCellAlive === false && moved === true) {
			createCell();
		} else if (isCellAlive === false && moved === false) {
			createCell();
		} else if (isCellAlive === true && moved === false) {
			deleteCell();
		}

		this.renderPopulation();
		this.drawField();
	}

	private initCalcSpeed(): void {
		const max = Number(this.nodes.popupSpeedRangeNode.max);
		const min = Number(this.nodes.popupSpeedRangeNode.min);

		const speedPercent = (this.speed - 1) / 9;
		const value = min + (speedPercent * (max - min));

		this.nodes.popupSpeedRangeNode.value = String(value);
		this.nodes.popupSpeedInfoNode.textContent = String(this.speed);
	}

	private calcSpeedInputChange = (): void => {
		const lastGameState = this.played;
		this.stopGame();

		const currentVal = this.nodes.popupSpeedRangeNode.valueAsNumber;
		const max = Number(this.nodes.popupSpeedRangeNode.max);
		const min = Number(this.nodes.popupSpeedRangeNode.min);

		const end = max - min;
		const currentValMod = currentVal - min;

		const currentValPercent = currentValMod / end;
		const newSpeed = Number(((currentValPercent * 9) + 1).toFixed(1));
		this.speed = newSpeed;

		this.nodes.popupSpeedInfoNode.textContent = String(this.speed);

		if (this.localStorageUse) this.setLocalStorage('speed', this.speed);

		if (lastGameState === true) this.startGame();
	}

	private useLocalStorage(): void {
		const lastLocalStorage = this.getLocalStorage();

		if (lastLocalStorage.random !== undefined) {
			this.random = lastLocalStorage.random;
		}
		if (lastLocalStorage.speed !== undefined) {
			this.speed = lastLocalStorage.speed;
		}
	}

	private clear = (): void => {
		this.stopGame();
		this.gameTime = 0;
		this.gameLastTime = 0;
		this.gameStartTime = 0;
		this.cycles = 0;
		this.initFields(false);
		this.drawField();
		this.renderTime();
		this.renderPopup();
	}

	// private reStart = (): void => {
	// 	this.stopGame();
	// this.gameTime = 0;
	// this.gameLastTime = 0;
	// this.gameStartTime = 0;
	// this.cycles = 0;
	// 	this.initFields();
	// 	this.drawField();
	// 	this.renderPopup();
	// 	this.startGame();
	// }

	private generateNewFields = (): void => {
		this.initFields(true);
		this.drawField();
		this.renderPopup();
	}

	private initNodes(canvasNode: HTMLCanvasElement, popupNode: HTMLElement): void {
		const popupPlayNode = this._querySelector<HTMLElement>(popupNode, '.popup__play');
		const popupPauseNode = this._querySelector<HTMLElement>(popupNode, '.popup__pause');
		const popupTimeNode = this._querySelector<HTMLElement>(popupNode, '.popup__time');
		const popupPopulationNode = this._querySelector<HTMLElement>(popupNode, '.popup__population');
		const popupCyclesNode = this._querySelector<HTMLElement>(popupNode, '.popup__cycles');
		const popupGenerateNode = this._querySelector<HTMLElement>(popupNode, '.popup__generate');
		const wrapperCanvasNode = this._querySelector<HTMLElement>(document, '.wrapper-canvas');
		const popupRandomCheckboxNode = this._querySelector<HTMLInputElement>(popupNode, '.popup__random-checkbox');
		const popupSpeedRangeNode = this._querySelector<HTMLInputElement>(popupNode, '.popup__speed-range');
		const popupSpeedInfoNode = this._querySelector<HTMLElement>(popupNode, '.popup__speed-info');
		const popupClearNode = this._querySelector<HTMLElement>(popupNode, '.popup__clear');
		const popupStepNode = this._querySelector<HTMLElement>(popupNode, '.popup__step');

		this.nodes = {
			canvasNode: canvasNode,
			popupNode: popupNode,
			popupPlayNode: popupPlayNode,
			popupPauseNode: popupPauseNode,
			popupTimeNode: popupTimeNode,
			popupPopulationNode: popupPopulationNode,
			popupCyclesNode: popupCyclesNode,
			popupGenerateNode: popupGenerateNode,
			wrapperCanvasNode: wrapperCanvasNode,
			popupRandomCheckboxNode: popupRandomCheckboxNode,
			popupSpeedRangeNode: popupSpeedRangeNode,
			popupSpeedInfoNode: popupSpeedInfoNode,
			popupClearNode: popupClearNode,
			popupStepNode: popupStepNode
		}
	}

	private _querySelector<T = Element>(parentNode: Element | Document, selector: string): T {
		const node = parentNode.querySelector(selector);
		if (node === null) {
			throw new Error(`GameOfLife: элемент с классом ${selector} не найден`);
		}
		return node as T;
	}


	private resizeAndDraw = (): void => {
		this.setCanvasSize();
		this.drawField();
	}

	private setColorCell = (): void => {
		this.colorCell = getComputedStyle(document.documentElement).getPropertyValue('--color');
	}

	private setColorCellAndDraw = (): void => {
		this.setColorCell();
		this.drawField();
	}

	private setCanvasSize = (): void => {
		const width = this.nodes.wrapperCanvasNode.offsetWidth;
		const height = this.nodes.wrapperCanvasNode.offsetHeight;

		const aspectRatio = this.cols / this.rows;

		const canvasWidth = Math.min(width, height * aspectRatio);
		const canvasHeight = canvasWidth / aspectRatio;

		this.cellSize = canvasWidth / this.cols;

		const xPadding = (width - canvasWidth) / 2;
		const yPadding = (height - canvasHeight) / 2;

		this.nodes.canvasNode.width = canvasWidth;
		this.nodes.canvasNode.height = canvasHeight;

		this.nodes.wrapperCanvasNode.style.padding = `${yPadding}px ${xPadding}px`;
	}

	private initFields(random = this.random): void {
		this.field = new Map<string, boolean>();
		this.buffer = new Map<string, boolean>();

		this.activeCells = 0;

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				const key = this.getKey(i, j);
				const fieldVal = Math.round(Math.random()) === 1;
				const val = random === true ? fieldVal : false;
				if (val === true) this.activeCells++;
				this.field.set(key, val);
			}
		}
	}

	private getKey(row: number, col: number): string {
		return `${row}-${col}`;
	}

	private drawField(): void {
		this.ctx.clearRect(0, 0, this.nodes.canvasNode.width, this.nodes.canvasNode.height);
		const cellSize = this.cellSize;

		this.ctx.fillStyle = this.colorCell;

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				const key = this.getKey(i, j);
				if (this.field.get(key)) {
					this.ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
				}
			}
		}
	}

	private countNeighbours(row: number, col: number): number {
		let count = 0;

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i === 0 && j === 0) continue;
				const r = row + i;
				const c = col + j;
				const key = this.getKey(r, c);
				if (this.field.get(key)) count++;
			}
		}

		return count;
	}

	private updateField(): void {
		this.activeCells = 0;

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				const neighbours = this.countNeighbours(i, j);
				const key = this.getKey(i, j);
				if (this.field.get(key)) {
					if (neighbours < 2 || neighbours > 3) {
						this.buffer.set(key, false);
					} else {
						this.activeCells++;
						this.buffer.set(key, true);
					}
				} else {
					if (neighbours === 3) {
						this.activeCells++;
						this.buffer.set(key, true);
					} else {
						this.buffer.set(key, false);
					}
				}
			}
		}

		[this.field, this.buffer] = [this.buffer, this.field];
	}

	private renderPopup(): void {
		this.renderPopulation();
		this.renderRandom();
		this.nodes.popupCyclesNode.textContent = String(this.cycles);
		// this.nodes.popupTimeNode.textContent = (this.gameTime / 1000).toFixed(1);
		this.nodes.popupRandomCheckboxNode.checked = this.random;
	}

	private renderTime(): void {
		let gameTime = Date.now() - this.gameStartTime + this.gameLastTime;
		if (this.gameStartTime === 0) gameTime = 0;
		this.gameTime = gameTime;
		this.nodes.popupTimeNode.textContent = (this.gameTime / 1000).toFixed(1);
	}

	private renderRandom(): void {
		if (this.random === true) {
			this.nodes.popupGenerateNode.classList.add('popup__generate_active');
		} else {
			this.nodes.popupGenerateNode.classList.remove('popup__generate_active');
		}
	}

	private renderPopulation(): void {
		this.nodes.popupPopulationNode.textContent = String(this.activeCells);
	}

	private stepGame = (): void => {
		this.updateField();
		this.drawField();
		this.cycles = this.cycles + 1;
		this.renderPopup();
	}

	private startGame(): void {
		this.played = true;
		this.gameStartTime = Date.now();
		this.animationObj = requestInterval(this.stepGame, this.interval / this.speed ** 1.5);
		this.animationTimeId = requestInterval(this.stepAnimationRenderTime);
	}

	private stepAnimationRenderTime = () => {
		this.renderTime();
	}

	public stopGame(): void {
		if (this.played === false) return;
		this.played = false;
		this.gameLastTime = this.gameTime;
		cancelAnimationFrame(this.animationObj.id);
		cancelAnimationFrame(this.animationTimeId.id);
	}

	private getLocalStorage(): GameOfLifeLocalStorage {
		return JSON.parse(localStorage.getItem('life') || '{}');
	}

	private setLocalStorage<T>(key: string, value: T): void {
		const lastLocalStorage = this.getLocalStorage();

		lastLocalStorage[key] = value;

		localStorage.setItem('life', JSON.stringify(lastLocalStorage));
	}

}


