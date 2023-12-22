import { ComponentRef, Type } from "@angular/core";
import { Observable } from "rxjs";
import { ModalComponent } from "./modal.component";

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

export interface ModalStateItem {
	id: string;
	componentModalContent: Type<any>;
	modalComponentRef: ComponentRef<ModalComponent>;
}
