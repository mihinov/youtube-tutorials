import { ComponentRef, Type } from "@angular/core";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { ModalComponent } from "./modal.component";

export interface ModalConfig {
	maxWidth?: string;
	minWidth?: string;
	minHeight?: string;
	maxHeight?: string;
	transitionDurationS?: number;
	data?: any;
}

export interface InternalModalConfig {
	maxWidth?: string;
	minWidth?: string;
	minHeight?: string;
	maxHeight?: string;
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

export interface ModalStateItem {
	id: string;
	componentModalContent: Type<any>;
	modalComponentRef: ComponentRef<ModalComponent>;
	state: {
		stateAfterClosed: Subject<any>;
		stateAfterOpened: ReplaySubject<any>;
	}
	obs: {
		afterClosed$: Observable<any>;
		afterOpened$: Observable<any>;
	}
}
