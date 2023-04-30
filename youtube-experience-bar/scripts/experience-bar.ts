import {
	ExperienceBarBalance,
	ExperienceBarCssClasses,
	ExperienceBarGrade,
	ExperienceBarGrades,
	ExperienceBarNodes
} from "../interfacesOrTypes";

export class ExperienceBar {

	private _grades: ExperienceBarGrades = {
		0: { name: 'Iron', min: 0, max: 60, nextGradeId: 1 },
		1: { name: 'Platinum', min: 60, max: 150, nextGradeId: 2 },
		2: { name: 'Diamond', min: 150, max: 300, nextGradeId: 3 },
		3: { name: 'Master', min: 300, max: 500, nextGradeId: 4 },
		4: { name: 'Grandmaster', min: 500, max: 800, nextGradeId: 5 },
		5: { name: 'Challenger', min: 800, max: 100_000, nextGradeId: null }
	};

	private _nodes: ExperienceBarNodes;

	private _cssClasses: ExperienceBarCssClasses = {
		balance: 'balance',
		balanceTotal: 'balance__total',
		balanceProgress: 'balance__progress',
		balanceGradeStart: 'balance__grade_start',
		balanceGradeEnd: 'balance__grade_end'
	};

	private _balance: ExperienceBarBalance = {
		initBalance: 0,
		addedBalance: 0,
		totalBalance: 0
	};

	private _currentGradeId: number = -1;

	constructor(injectedNode: Element) {
		this._initNodes(injectedNode);
		this._calcCurrentGradeId();
		this._renderBalance();
	}

	private _initNodes(injectedNode: Element): void {
		injectedNode.innerHTML = `
			<div class="balance">
				<div class="balance__text">
					Ваш баланc:
					<span class="balance__total">0</span>
				</div>
				<progress class="balance__progress"></progress>
				<div class="balance__grades">
					<div class="balance__grade balance__grade_start">Iron</div>
					<div class="balance__grade balance__grade_end">Platinum</div>
				</div>
			</div>
		`;

		const balanceNode = this._querySelector<HTMLElement>(injectedNode, '.' +  this._cssClasses.balance);

		this._nodes = {
			balanceNode: balanceNode,
			balanceTotalNode: this._querySelector<HTMLElement>(balanceNode, '.' + this._cssClasses.balanceTotal),
			balanceProgressNode: this._querySelector<HTMLProgressElement>(balanceNode, '.' + this._cssClasses.balanceProgress),
			balanceGradeStartNode: this._querySelector<HTMLElement>(balanceNode, '.' + this._cssClasses.balanceGradeStart),
			balanceGradeEndNode: this._querySelector<HTMLElement>(balanceNode, '.' + this._cssClasses.balanceGradeEnd)
		}

	}

	private _querySelector<T = Element>(parentNode: Element | Document, selector: string): T {
		const node = parentNode.querySelector(selector);
		if (node === null) {
			throw new Error(`ExperienceBar: элемент с классом ${selector} не найден`);
		}
		return node as T;
	}

	/**
	 * Функция для добавления нового баланса
	 * @param {number} newBalance - Новое значение баланса, положительное число
	 */
	public addBalance(newBalance: number): void {
		this._balance.addedBalance = newBalance;
		this._calcTotalBalance();
		this._calcCurrentGradeId();
		this._renderBalance();
	}

	/**
	 * Функция для установки изначального баланса
	 * @param {number} initBalance - Значение изначального баланса
	 */
	public setInitBalance(initBalance: number): void {
		this._balance.initBalance = initBalance;
		this._calcTotalBalance();
		this._calcCurrentGradeId();
		this._renderBalance();
	}

	private _renderBalance(): void {
		const currentGrade = this.getCurrentGrade();
		const nextGrade = this._grades[this._currentGradeId + 1];
		const balance = this._balance.totalBalance;
		const max = currentGrade.max;
		const min = currentGrade.min;

		this._nodes.balanceProgressNode.setAttribute('min', String(0));
		this._nodes.balanceProgressNode.setAttribute('max', String(max - min));
		this._nodes.balanceProgressNode.value = balance - min;
		this._nodes.balanceTotalNode.textContent = String(balance);
		this._nodes.balanceGradeStartNode.textContent = currentGrade.name;

		if (nextGrade !== undefined) {
			this._nodes.balanceGradeEndNode.textContent = nextGrade.name;
		} else {
			this._nodes.balanceGradeEndNode.textContent = '∞';
		}

	}

	private _calcTotalBalance(): void {
		this._balance.totalBalance = this._balance.initBalance + this._balance.addedBalance;
	}

	private _calcCurrentGradeId(): void {
		const totalBalance = this._balance.totalBalance;

		for (const idGrade in this._grades) {
			const grade = this._grades[idGrade];
			const min = grade.min;
			const max = grade.max;

			if (totalBalance >= min && totalBalance < max) {
				this._currentGradeId = Number(idGrade);
				break;
			}

		}
	}

	public getCurrentGrade(): ExperienceBarGrade {
		if (this._currentGradeId === -1) {
			throw new Error('ExperienceBar: текущий грейд не установлен');
		}

		return this._grades[this._currentGradeId];
	}
}
