import { requestInterval } from "./functions/request-interval";
import { restrictInputValue } from "./functions/restrict-input";

export class GameOfLife {
	ctx;
	rows;
	cols;
	cellSize;
	field;
	buffer;
	colorCell;
	animationObj;
	nodes;
	cycles = 0;
	played = false;
	interval = 500;
	gameTime = 0;
	gameStartTime = 0;
	gameLastTime = 0;
	random = false;
	speed = 0;
	activeCells = 0;
	localStorageUse = false;
	isDragging = false;
	isRealDragging = false;
	animationTimeId;
	worker = new Worker(new URL('workers/worker-game-of-life-logic.js', import.meta.url));
	loading = false;
	focusedInput = null;
	popupHidden = false;

	constructor({ injectedNode, cellsCountX, cellsCountY, random, speed, localStorageUse, popupHidden }) {
		if (speed < 1) {
			throw new Error('GameOfLife: speed не может быть меньше 1');
		}
		if (speed > 10) {
			throw new Error('GameOfLife: speed не может быть больше 10');
		}

		this.rows = cellsCountX;
		this.cols = cellsCountY;
		this.random = random;
		this.speed = speed;
		this.localStorageUse = localStorageUse;
		this.popupHidden = popupHidden;

		this.initNodes(injectedNode);
		this.ctx = this.nodes.canvasNode.getContext("2d");
		if (this.localStorageUse) this.useLocalStorage();
		this.initCalcSpeed();
		this.setCanvasSize();
		this.setColorCell();
		this.initInputNodes();
		this.initPopupHidden();

		this.sendWorkerInitFields({
			random: this.random,
			rows: this.rows,
			cols: this.cols
		})
		.then(({ activeCells, field, buffer }) => {
			this.initEventListeners();
			this.drawField();
			this.renderPopup();
		});
	}

	initInputNodes() {
		this.nodes.popupInputRowsNode.value = String(this.rows);
		this.nodes.popupInputColsNode.value = String(this.cols);
	}

	initPopupHidden() {
		this.togglePopup(this.popupHidden);
	}

	disableInputs() {
		this.nodes.popupInputRowsNode.disabled = true;
		this.nodes.popupInputColsNode.disabled = true;
	}

	enableInputs() {
		this.nodes.popupInputRowsNode.disabled = false;
		this.nodes.popupInputColsNode.disabled = false;

		if (this.focusedInput !== null) {
			this.focusedInput.focus();
			this.focusedInput = null;
		}
	}

	sendWorkerInitFields({
		random, rows, cols
	}) {

		this.load();
		this.disableInputs();

		this.worker.postMessage({
			type: 'initFields',
			payload: {
				random: random,
				rows: rows,
				cols: cols
			}
		});

		const resultWorker = new Promise((resolve, reject) => {
			this.worker.onmessage = (event) => {
				const message = event.data;

				this.loadComplete();
				this.enableInputs();

				if (message.type === 'result: initFields') {
					const data = message.data;
					const { activeCells, field, buffer } = data;

					this.activeCells = activeCells;
					this.field = field;
					this.buffer = buffer;

					resolve(data);
				}

				reject(false);
			};
		});

		return resultWorker;
	}

	load() {
		this.loading = true;
		this.nodes.popupLoadNode.classList.add('popup__load_active');
		this.nodes.popupNode.classList.add('popup_load');
	}

	loadComplete() {
		this.loading = false;
		this.nodes.popupLoadNode.classList.remove('popup__load_active');
		this.nodes.popupNode.classList.remove('popup_load');
	}

	initEventListeners() {
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

		this.nodes.popupGenerateNode.addEventListener('click', this.generateNewFields);

		this.nodes.canvasNode.addEventListener('pointerdown', (event) => {
			if (this.loading === true) return;
			if (event.button === 2 || event.button === 1) return false; // Если это правая или средняя кнопка мыши, это не тот клик
			this.isDragging = true;
			this.isRealDragging = false;
		});

		this.nodes.canvasNode.addEventListener('pointermove', (event) => {
			if (event.button === 2 || event.button === 1) return false; // Если это правая или средняя кнопка мыши, это не тот клик
			if (this.isDragging === true && this.loading === false) {
				this.isRealDragging = true;
				this.generateCellByClick(event, true)
			};
		});

		document.addEventListener('pointerup', (event) => {
			if (event.button === 2 || event.button === 1) return false; // Если это правая или средняя кнопка мыши, это не тот клик
			const clickOnPopupBool = this.isClickOnElement(event, this.nodes.popupNode);
			if (clickOnPopupBool === true) return;
			if (this.isRealDragging === false && this.loading === false) this.generateCellByClick(event, false);

			this.isDragging = false;
			this.isRealDragging = false;
		});

		this.nodes.popupRandomCheckboxNode.addEventListener('input', () => {
			this.random = !this.random;
			if (this.localStorageUse) this.setLocalStorage('random', this.random);
			this.renderRandom();
		});

		this.nodes.popupSpeedRangeNode.addEventListener('input', this.calcSpeedInputChange);
		this.nodes.popupClearNode.addEventListener('click', this.clear);

		this.nodes.popupStepNode.addEventListener('click', () => {
			this.disableInputs();
			this.stepGame()?.then(data => {
				this.enableInputs();
			});
		});

		this.nodes.popupInputRowsNode.addEventListener('input', () => {
			const newRows = restrictInputValue(this.nodes.popupInputRowsNode, 0, 2000);
			if (this.localStorageUse) this.setLocalStorage('rows', newRows);

			this.focusedInput = this.nodes.popupInputRowsNode;
			this.resizeFieldRows(newRows);
		});

		this.nodes.popupInputColsNode.addEventListener('input', () => {
			const newCols = restrictInputValue(this.nodes.popupInputColsNode, 0, 2000);
			if (this.localStorageUse) this.setLocalStorage('cols', newCols);

			this.focusedInput = this.nodes.popupInputColsNode;
			this.resizeFieldCols(newCols);
		});

		this.nodes.popupCloseNode.addEventListener('click', () => {
			this.popupHidden = !this.popupHidden;
			this.togglePopup(this.popupHidden);
		});
	}

	togglePopup = (popupHidden) => {
		if (this.localStorageUse === true) this.setLocalStorage('popupHidden', this.popupHidden);

		if (this.popupHidden === true) {
			this.nodes.popupNode.classList.add('popup_hidden');
			this.nodes.popupCloseNode.textContent = 'Открыть';
		} else {
			this.nodes.popupNode.classList.remove('popup_hidden');
			this.nodes.popupCloseNode.textContent = 'Скрыть';
		}
	}

	resizeFieldRows(newRows) {
		if (this.loading === true) return;

		this.sendWorkerResizeField(newRows, this.cols, this.random)
		.then((data) => {
			this.setCanvasSize();
			this.drawField();
			this.renderTime();
			this.renderPopup();
		});
	}

	resizeFieldCols(newCols) {
		if (this.loading === true) return;

		this.sendWorkerResizeField(this.rows, newCols, this.random)
		.then((data) => {
			this.setCanvasSize();
			this.drawField();
			this.renderTime();
			this.renderPopup();
		});
	}

	sendWorkerResizeField(newRows, newCols, random) {
		this.load();
		this.disableInputs();

		this.worker.postMessage({
			type: 'resizeField',
			payload: {
				newRows: newRows,
				newCols: newCols,
				random: random
			}
		});

		const resultWorker = new Promise((resolve, reject) => {
			this.worker.onmessage = (event) => {
				const message = event.data;

				this.loadComplete();
				this.enableInputs();


				if (message.type === 'result: resizeField') {
					const data = message.data;
					const { field, buffer, activeCells, rows, cols } = data;

					this.field = field;
					this.buffer = buffer;
					this.activeCells = activeCells;
					this.rows = rows;
					this.cols = cols;

					resolve(data);
				}

				reject(false);
			};
		}).catch(() => {});

		return resultWorker;
	}

	isClickOnElement(event, element) {
		const target = event.target; // Получаем целевой элемент клика

		// Проверяем, является ли целевой элемент или его родительские элементы равным заданному элементу
		let currentNode = target;
		while (currentNode != null) {
			if (currentNode === element) {
				return true;
			}
			currentNode = currentNode.parentElement;
		}

		// Если не было найдено совпадений, возвращаем false
		return false;
	}

	sendWorkerDeleteOrCreateCell(typeAction, key) {
		this.load();

		this.worker.postMessage({
			type: 'deleteOrCreateCell',
			payload: {
				typeAction: typeAction,
				key: key
			}
		});

		const resultWorker = new Promise((resolve, reject) => {
			this.worker.onmessage = (event) => {
				const message = event.data;

				this.loadComplete();

				if (message.type === 'result: deleteOrCreateCell') {
					const data = message.data;
					resolve(data);
				}

				reject(false);
			};
		});

		return resultWorker;
	}

	generateCellByClick = (event, moved = false) => {
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
			this.sendWorkerDeleteOrCreateCell('delete', key).then();
		};

		const createCell = () => {
			this.activeCells++;
			this.field.set(key, true);
			this.sendWorkerDeleteOrCreateCell('create', key).then();
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

	initCalcSpeed() {
		const max = Number(this.nodes.popupSpeedRangeNode.max);
		const min = Number(this.nodes.popupSpeedRangeNode.min);

		const speedPercent = (this.speed - 1) / 9;
		const value = min + (speedPercent * (max - min));

		this.nodes.popupSpeedRangeNode.value = String(value);
		this.nodes.popupSpeedInfoNode.textContent = String(this.speed);
	}

	calcSpeedInputChange = () => {
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

	useLocalStorage() {
		const lastLocalStorage = this.getLocalStorage();

		if (lastLocalStorage.random !== undefined) {
			this.random = lastLocalStorage.random;
		}

		if (lastLocalStorage.speed !== undefined) {
			this.speed = lastLocalStorage.speed;
		}

		if (lastLocalStorage.rows !== undefined) {
			this.rows = lastLocalStorage.rows;
		}

		if (lastLocalStorage.cols !== undefined) {
			this.cols = lastLocalStorage.cols;
		}

		if (lastLocalStorage.popupHidden !== undefined) {
			this.popupHidden = lastLocalStorage.popupHidden;
		}
	}

	clear = () => {
		if (this.loading === true) false;

		this.stopGame();
		this.gameTime = 0;
		this.gameLastTime = 0;
		this.gameStartTime = 0;
		this.cycles = 0;

		this.disableInputs();

		this.sendWorkerInitFields({
			random: false,
			rows: this.rows,
			cols: this.cols
		}).then(data => {
			this.drawField();
			this.renderTime();
			this.renderPopup();
			this.enableInputs();
		});
	}

	generateNewFields = () => {
		if (this.loading === true) false;

		this.sendWorkerInitFields({
			random: true,
			rows: this.rows,
			cols: this.cols
		}).then(data => {
			this.cycles = 0;
			this.drawField();
			this.renderPopup();
		});
	}

	initNodes(injectedNode) {

		injectedNode.innerHTML = `
			<div class="wrapper">
				<div class="wrapper-canvas">
					<canvas class="canvas"></canvas>
				</div>

				<div class="popup">
					<div class="popup__item popup__play">Play</div>
					<div class="popup__item popup__pause">Пауза</div>
					<div class="popup__item popup__clear">Очистить</div>
					<div class="popup__item popup__step">Шаг</div>
					<div class="popup__item popup__generate">Сгенерировать</div>
					<label class="popup__item popup__random-checkbox-item">
						<input type="checkbox" class="popup__random-checkbox">
						<span>Рандом</span>
					</label>
					<div class="popup__item">
						Время:
						<span class="popup__time">0.0</span>
					</div>
					<div class="popup__item">Поколение: <span class="popup__cycles">0</span></div>
					<div class="popup__item">Население: <span class="popup__population">0</span></div>
					<div class="popup__item">
						<span>Скорость: </span>
						<span class="popup__speed-info">1</span>
					</div>
					<div class="popup__item">
						<input class="popup__speed-range" type="range" min="0" max="100" value="50">
					</div>

					<div class="popup__item popup__item_inputs">
						<input type="number" class="popup__rows popup__inputs" placeholder="rows" min="0" max="2000">
						<input type="number" class="popup__cols popup__inputs" placeholder="cols" min="0" max="2000">
					</div>

					<div class="popup__item popup__close">Скрыть</div>

					<div class="popup__item popup__load">Загрузка</div>

				</div>

			</div>
		`;

		const popupNode = this._querySelector(injectedNode, '.popup');
		const canvasNode = this._querySelector(injectedNode, '.canvas');
		const wrapperCanvasNode = this._querySelector(injectedNode, '.wrapper-canvas');
		const popupPlayNode = this._querySelector(popupNode, '.popup__play');
		const popupPauseNode = this._querySelector(popupNode, '.popup__pause');
		const popupTimeNode = this._querySelector(popupNode, '.popup__time');
		const popupPopulationNode = this._querySelector(popupNode, '.popup__population');
		const popupCyclesNode = this._querySelector(popupNode, '.popup__cycles');
		const popupGenerateNode = this._querySelector(popupNode, '.popup__generate');
		const popupRandomCheckboxNode = this._querySelector(popupNode, '.popup__random-checkbox');
		const popupSpeedRangeNode = this._querySelector(popupNode, '.popup__speed-range');
		const popupSpeedInfoNode = this._querySelector(popupNode, '.popup__speed-info');
		const popupClearNode = this._querySelector(popupNode, '.popup__clear');
		const popupStepNode = this._querySelector(popupNode, '.popup__step');
		const popupLoadNode = this._querySelector(popupNode, '.popup__load');
		const popupInputRowsNode = this._querySelector(popupNode, '.popup__rows');
		const popupInputColsNode = this._querySelector(popupNode, '.popup__cols');
		const popupCloseNode = this._querySelector(popupNode, '.popup__close');

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
			popupStepNode: popupStepNode,
			popupLoadNode: popupLoadNode,
			popupInputRowsNode: popupInputRowsNode,
			popupInputColsNode: popupInputColsNode,
			popupCloseNode: popupCloseNode
		}
	}

	_querySelector(parentNode, selector) {
		const node = parentNode.querySelector(selector);
		if (node === null) {
			throw new Error(`GameOfLife: элемент с классом ${selector} не найден`);
		}
		return node;
	}


	resizeAndDraw = () => {
		this.setCanvasSize();
		this.drawField();
	}

	setColorCell = () => {
		this.colorCell = getComputedStyle(document.documentElement).getPropertyValue('--color');
	}

	setColorCellAndDraw = () => {
		this.setColorCell();
		this.drawField();
	}

	setCanvasSize = () => {
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

	getKey(row, col) {
		return `${row}-${col}`;
	}

	drawField() {
		this.load();

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

		this.loadComplete();
	}

	sendWorkerUpdateField() {
		this.load();

		this.worker.postMessage({
			type: 'updateField',
			payload: {}
		});

		const resultWorker = new Promise((resolve, reject) => {
			this.worker.onmessage = (event) => {
				const message = event.data;

				this.loadComplete();

				if (message.type === 'result: updateField') {
					const data = message.data;
					const { activeCells, field, buffer } = data;

					this.activeCells = activeCells;
					this.field = field;
					this.buffer = buffer;

					resolve(data);
				}

				reject(false);
			};
		});

		return resultWorker;
	}

	renderPopup() {
		this.renderPopulation();
		this.renderRandom();
		this.nodes.popupCyclesNode.textContent = String(this.cycles);
		this.nodes.popupRandomCheckboxNode.checked = this.random;
	}

	renderTime() {
		let gameTime = Date.now() - this.gameStartTime + this.gameLastTime;
		if (this.gameStartTime === 0) gameTime = 0;
		this.gameTime = gameTime;

		this.nodes.popupTimeNode.textContent = (this.gameTime / 1000).toFixed(1);
	}

	renderRandom() {
		if (this.random === true) {
			this.nodes.popupGenerateNode.classList.add('popup__generate_active');
		} else {
			this.nodes.popupGenerateNode.classList.remove('popup__generate_active');
		}
	}

	renderPopulation() {
		this.nodes.popupPopulationNode.textContent = String(this.activeCells);
	}

	stepGame = () => {
		if (this.loading === true) return;

		return this.sendWorkerUpdateField()
		.then(data => {
			this.drawField();
			this.cycles = this.cycles + 1;
			this.renderPopup();
			return data;
		});
	}

	startGame() {
		this.disableInputs();
		this.played = true;
		this.gameStartTime = Date.now();
		this.animationObj = requestInterval(this.stepGame, this.interval / this.speed ** 1.5);
		this.animationTimeId = requestInterval(this.stepAnimationRenderTime);
	}

	stepAnimationRenderTime = () => {
		this.renderTime();
	}

	stopGame() {
		if (this.played === false) return;
		this.played = false;
		this.gameLastTime = this.gameTime;
		cancelAnimationFrame(this.animationObj.id);
		cancelAnimationFrame(this.animationTimeId.id);
		this.enableInputs();
	}

	getLocalStorage() {
		return JSON.parse(localStorage.getItem('life') || '{}');
	}

	setLocalStorage(key, value) {
		const lastLocalStorage = this.getLocalStorage();

		lastLocalStorage[key] = value;

		localStorage.setItem('life', JSON.stringify(lastLocalStorage));
	}

}


