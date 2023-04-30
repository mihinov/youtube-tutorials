export interface ExperienceBarGrade {
	name: string;
	min: number;
	max: number;
	nextGradeId: null | number;
}

export type ExperienceBarGrades = Record<number, ExperienceBarGrade>;

export interface ExperienceBarNodes {
	balanceNode: HTMLElement;
	balanceTotalNode: HTMLElement;
	balanceProgressNode: HTMLProgressElement;
	balanceGradeStartNode: HTMLElement;
	balanceGradeEndNode: HTMLElement;
}

export interface ExperienceBarCssClasses {
	balance: string;
	balanceTotal: string;
	balanceProgress: string;
	balanceGradeStart: string;
	balanceGradeEnd: string;
}

export interface ExperienceBarBalance {
	initBalance: number;
	addedBalance: number;
	totalBalance: number;
}
