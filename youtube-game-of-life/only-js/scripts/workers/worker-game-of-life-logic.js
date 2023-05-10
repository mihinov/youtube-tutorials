class GameLifeLogic {
	#activeCells = 0;
	#random = false;

	get activeCells() {
		return this.#activeCells;
	}

	/**
	 * Хранит состояние поля в виде карты, где ключ - строка с координатами ячейки, значение - булево значение,
	 * показывающее, жива ли ячейка
	 * @type {Map<string, boolean>}
	 */
	#field = new Map();

	get field() {
		return this.#field;
	}

	/**
	 * Хранит временное состояние поля в виде карты, где ключ - строка с координатами ячейки,
	 * значение - булево значение, показывающее, жива ли ячейка
	 * @type {Map<string, boolean>}
	 */
	#buffer = new Map();

	get buffer() {
		return this.#buffer;
	}


	#rows = 10;
	#cols = 10;

	get rows() {
		return this.#rows;
	}

	get cols() {
		return this.#cols;
	}

	constructor() {

	}

	/**
	 * Приватная функция
	 * Создаёт поле с нуля
	 * @param {boolean} random - рандомно генерировать элементы или нет
	 * @returns {void}
	 */
	#initFields(random) {
		this.#field = new Map();
		this.#buffer = new Map();
		this.#activeCells = 0;

		for (let i = 0; i < this.#rows; i++) {
			for (let j = 0; j < this.#cols; j++) {
				const key = this.#getKey(i, j);
				const rndVal = Math.round(Math.random()) === 1;
				const val = random === true ? rndVal : false;
				if (val === true) this.#activeCells++;
				this.#field.set(key, val);
			}
		}
	}

	/**
	 * Публичная функция
	 * Создаёт поле с нуля
	 * @param {boolean} random - рандомно генерировать элементы или нет
	 * @param {number} rows - количество строк поля
	 * @param {number} cols - количество столбцов поля
	 * @returns {void}
	 */
	initFields(random, rows, cols) {
		this.#rows = rows;
		this.#cols = cols;
		this.#random = random;

		this.#initFields(random);

		return {
			cols: this.cols,
			rows: this.rows,
			activeCells: this.activeCells,
			field: this.field,
			buffer: this.buffer
		}
	}

	/**
	 * Возвращает ключ в формате строки для определенной строки и столбца
	 * @param {number} row - номер строки
	 * @param {number} col - номер столбца
	 * @returns {string} - ключ в формате строки
	 */
	#getKey(row, col) {
		return `${row}-${col}`;
	}

	/**
	 * Возвращает количество соседей для определенной ячейки
	 * @param {number} i - номер строки
	 * @param {number} j - номер столбца
	 * @returns {number} - количество соседей
	 */
	#countNeighbours(i, j) {
		let count = 0;

		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
				if (x === 0 && y === 0) continue; // Пропустить текущую ячейку
				const row = (i + x + this.#rows) % this.#rows; // Использование операции % для циклической границы
				const col = (j + y + this.#cols) % this.#cols; // Использование операции % для циклической границы
				const key = this.#getKey(row, col);

				if (this.#field.get(key)) {
					count++;
				}
			}
		}

		return count;
	}

	#updateField() {
		this.#activeCells = 0;
		this.#buffer = new Map();

		for (let i = 0; i < this.#rows; i++) {
			for (let j = 0; j < this.#cols; j++) {
				const neighbours = this.#countNeighbours(i, j);
				const key = this.#getKey(i, j);

				if (this.#field.get(key)) {
					if (neighbours < 2 || neighbours > 3) {
						this.#buffer.set(key, false);
					} else {
						this.#activeCells++;
						this.#buffer.set(key, true);
					}
				} else {
					if (neighbours === 3) {
						this.#activeCells++;
						this.#buffer.set(key, true);
					} else {
						this.#buffer.set(key, false);
					}
				}
			}
		}

		[this.#field, this.#buffer] = [this.#buffer, this.#field];
	}

	updateField() {
		this.#updateField();

		return {
			cols: this.cols,
			rows: this.rows,
			activeCells: this.activeCells,
			field: this.field,
			buffer: this.buffer
		}
	}

	/**
	 * Возвращает количество соседей для определенной ячейки
	 * @param {'delete' | 'create'} typeAction - номер строки
	 * @param {string} key - номер столбца
	 */
	deleteOrCreateCell(typeAction, key) {
		if (typeAction === 'delete') {
			this.#activeCells--;
			this.#field.set(key, false);
		} else if (typeAction === 'create') {
			this.#activeCells++
			this.#field.set(key, true);
		}
	}

	/**
	 * Приватная функция
	 * Изменяет размеры игрового поля
	 * @param {number} newRows - количество строк
	 * @param {number} newCols - количество стобцов
	 * @param {boolean} random - рандомно генерировать ячейки или нет
	 */
	#resizeField(newRows, newCols, random) {
		if (newRows === this.#rows && newCols === this.#cols) return;

		const oldField = this.#field;
		const oldRows = this.#rows;
		const oldCols = this.#cols;

		this.#random = random;
		this.#rows = newRows;
		this.#cols = newCols;
		this.#field = new Map();
		this.#buffer = new Map();
		this.#activeCells = 0;

		for (let i = 0; i < newRows; i++) {
			for (let j = 0; j < newCols; j++) {
				const key = this.#getKey(i, j);
				const val = oldField.get(key) || false;
				if (val === true) this.#activeCells++;
				this.#field.set(key, val);
			}
		}

		if (newRows > oldRows || newCols > oldCols) {
			for (let i = 0; i < newRows; i++) {
				for (let j = 0; j < newCols; j++) {
					const key = this.#getKey(i, j);
					if (!oldField.has(key)) {
						const rndVal = Math.round(Math.random()) === 1;
						const val = this.#random === true ? rndVal : false;
						if (val === true) this.#activeCells++;
						this.#field.set(key, val);
					}
				}
			}
		}

		if (newRows < oldRows || newCols < oldCols) {
			for (let i = 0; i < newRows; i++) {
				for (let j = 0; j < newCols; j++) {
					const key = this.#getKey(i, j);
					const val = !!oldField.get(key);

					if (val === true) this.#activeCells++;

					this.#buffer.set(key, val);
				}
			}
			this.#field = this.#buffer;
			this.#buffer = oldField;
		}
	}

	/**
	 * Публичная функция
	 * Изменяет размеры игрового поля
	 * @param {number} newRows - количество строк
	 * @param {number} newCols - количество стобцов
	 * @param {boolean} random - рандомно генерировать ячейки или нет
	 */
	resizeField(newRows, newCols, random) {
		this.#resizeField(newRows, newCols, random);

		return {
			cols: this.cols,
			rows: this.rows,
			activeCells: this.activeCells,
			field: this.field,
			buffer: this.buffer
		}
	}


}

const gameOfLife = new GameLifeLogic();

onmessage = function(event) {
	const data = event.data;
	const type = data.type;
	const payload = data.payload;

	if (type === 'initFields') {
		const dataToSend = gameOfLife.initFields(payload.random, payload.rows, payload.cols);

		postMessage({
			type: 'result: initFields',
			data: dataToSend
		});

	} else if (type === 'updateField') {
		const dataToSend = gameOfLife.updateField();

		postMessage({
			type: 'result: updateField',
			data: dataToSend
		});

	} else if (type === 'deleteOrCreateCell') {
		const dataToSend = gameOfLife.deleteOrCreateCell(payload.typeAction, payload.key);

		postMessage({
			type: 'result: deleteOrCreateCell',
			data: dataToSend
		});

	} else if (type === 'resizeField') {
		const dataToSend = gameOfLife.resizeField(payload.newRows, payload.newCols, payload.random);

		postMessage({
			type: 'result: resizeField',
			data: dataToSend
		});

	}
};
