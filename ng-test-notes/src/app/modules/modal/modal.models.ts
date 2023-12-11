import { Observable } from "rxjs";

export interface ModalConfig {
	maxWidth?: number;
	minWidth?: number;
	transitionDurationS?: number;
	data?: any;
}

export interface InternalModalConfig {
	maxWidth: number;
	minWidth: number;
	transitionDurationS: number;
	data?: any;
}

export interface ModalRef {
	afterClosed: () => Observable<any>;
	afterOpened: () => Observable<any>;
	close: () => void,
	destroy: () => void,
	open: () => void
}
