import { ComponentRef, Type } from "@angular/core";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { ModalComponent } from "./modal.component";

export interface ModalConfig {
	maxWidth?: string;
	minWidth?: string;
	minHeight?: string;
	maxHeight?: string;
	transitionDuration?: number;
	data?: any;
}

export interface InternalModalConfig {
	maxWidth?: string;
	minWidth?: string;
	minHeight?: string;
	maxHeight?: string;
	transitionDuration: number;
	data?: any;
}

export interface ModalRef {
	afterClosed: () => Observable<any>;
	afterOpened: () => Observable<any>;
	open: (data?: any) => void;
	close: (dialogResult?: any) => void;
	destroy: (dialogResult?: any) => void;
}

export interface ModalStateItem {
	id: string;
	componentModalContent: Type<any>;
	modalComponentRef: ComponentRef<ModalComponent>;
	state: {
		stateAfterClosed: Subject<any | void>;
		stateAfterOpened: ReplaySubject<any | void>;
	}
	obs: {
		afterClosed$: Observable<any | void>;
		afterOpened$: Observable<any | void>;
	}
}

export interface CloseModalInputArgs {
	isDestroy: boolean;
	dialogResult?: any;
}
