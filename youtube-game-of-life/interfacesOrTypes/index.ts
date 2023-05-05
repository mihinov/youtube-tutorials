export interface GameOfLifeParams {
	canvasNode: HTMLCanvasElement;
	popupNode: HTMLElement;
	cellsCountX: number;
	cellsCountY: number;
	random: boolean;
	speed: number;
	localStorageUse: boolean;
}

export interface GameOfLifeNodes {
	canvasNode: HTMLCanvasElement;
	popupNode: HTMLElement;
	popupPlayNode: HTMLElement;
	popupPauseNode: HTMLElement;
	popupTimeNode: HTMLElement;
	popupPopulationNode: HTMLElement;
	popupCyclesNode: HTMLElement;
	popupGenerateNode: HTMLElement;
	wrapperCanvasNode: HTMLElement;
	popupRandomCheckboxNode: HTMLInputElement;
	popupSpeedInfoNode: HTMLElement;
	popupSpeedRangeNode: HTMLInputElement;
	popupClearNode: HTMLElement;
	popupStepNode: HTMLElement;
}

export interface GameOfLifeLocalStorage {
	random: boolean | undefined;
	speed: number | undefined;
}
