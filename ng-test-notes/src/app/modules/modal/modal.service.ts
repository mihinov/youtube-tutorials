import { Injectable, ComponentFactoryResolver, ComponentRef, Type, ApplicationRef, Injector, Inject } from '@angular/core';
import { ModalComponent } from './modal.component';
import { BehaviorSubject, Observable, ReplaySubject, Subject, take } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ModalConfig, ModalRef, ModalStateItem } from './modal.models';
import { ModalModule } from './modal.module';

@Injectable({
	providedIn: ModalModule
})
export class ModalService {
	private stateModals: BehaviorSubject<ModalStateItem[]> = new BehaviorSubject<ModalStateItem[]>([]);

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly appRef: ApplicationRef,
    private readonly injector: Injector,
		@Inject(DOCUMENT) private readonly document: Document
  ) {

	}

  public open(component: Type<any>, config?: ModalConfig): ModalRef {

		const modal = this.getModal(component);

		// Если модальное окно уже создано
		if (modal !== null) {
			return this._open(modal, config);
		}

		return this._create(component, config);
  }

  private closeAndDestroy(modalStateItem: ModalStateItem): void {
		const modalComponentRefInstance = modalStateItem.modalComponentRef.instance;
		if (modalComponentRefInstance.isOpen === false) {
			this._destroy(modalStateItem);
			return;
		}

		const animationEnd$ = modalComponentRefInstance.closeModal();

		if (animationEnd$ === null) return;

		animationEnd$
			.pipe(take(1))
			.subscribe(() => this._destroy(modalStateItem));
  }

	private _destroy(modalStateItem: ModalStateItem): void {
		modalStateItem.state.stateAfterClosed.next(null);
		this.appRef.detachView(modalStateItem.modalComponentRef.hostView);
		modalStateItem.modalComponentRef.destroy();
		this.deleteModal(modalStateItem);
	}

	private _close(modalStateItem: ModalStateItem): void {
		modalStateItem.state.stateAfterClosed.next(null);
	}

	private getModal(component: Type<any>): ModalStateItem | null {
		const modals = this.stateModals.value;

		const findedModal = modals.find((modal) => modal.componentModalContent === component);

		if (findedModal === undefined) return null;

		return findedModal;
	}

	private deleteModal(modalStateItem: ModalStateItem): void {
		const stateModalsArr = this.stateModals.value;

		const findedModalIdx = stateModalsArr.findIndex((modal) => modal.modalComponentRef === modalStateItem.modalComponentRef);

		if (findedModalIdx !== -1) {
			stateModalsArr.splice(findedModalIdx, 1);
		}

		this.stateModals.next(stateModalsArr);
	}

	private getReturnObj(modalStateItem: ModalStateItem): ModalRef {
		const internalConfig = modalStateItem.modalComponentRef.instance.modalConfig;

		return {
			afterClosed: () => modalStateItem.obs.afterClosed$,
			afterOpened: () => modalStateItem.obs.afterOpened$,
			close: () => this._close(modalStateItem),
			destroy: () => this.closeAndDestroy(modalStateItem),
			open: () => this._open(modalStateItem)
		};
	}

	private createModalStateItem(component: Type<any>, modalComponentRef: ComponentRef<ModalComponent>): ModalStateItem {
		const stateAfterClosed = new Subject<any>();
		const stateAfterOpened = new ReplaySubject<any>(1);

		const modalStateItem: ModalStateItem = {
			id: window.crypto.randomUUID(),
			componentModalContent: component,
			modalComponentRef: modalComponentRef,
			state: {
				stateAfterClosed: stateAfterClosed,
				stateAfterOpened: stateAfterOpened
			},
			obs: {
				afterClosed$: stateAfterClosed.pipe(take(1)),
				afterOpened$: stateAfterOpened.pipe(take(1))
			}
		};

		return modalStateItem;
	}

	private _create(component: Type<any>, config?: ModalConfig): ModalRef {
		const modalComponentRef = this.componentFactoryResolver.resolveComponentFactory(ModalComponent).create(this.injector);

		const modalStateItem = this.createModalStateItem(component, modalComponentRef);

		modalStateItem.state.stateAfterOpened.next(null);

		modalComponentRef.instance.close
			.pipe(take(1))
			.subscribe(() => this._close(modalStateItem));

		const returnRef = this.getReturnObj(modalStateItem);

		modalComponentRef.instance.createAndOpenModal({
			config: config,
			returnRef: returnRef,
			componentModalContent: component
		});

		this.appRef.attachView(modalComponentRef.hostView);
		this.document.body.appendChild(modalComponentRef.location.nativeElement);
		this.stateModals.next([...this.stateModals.value, modalStateItem]);

		return returnRef;
	}

	private _open(modalStateItem: ModalStateItem, config?: ModalConfig): ModalRef {
		const modalComponentRefInstance = modalStateItem.modalComponentRef.instance;

		if (config === undefined) {
			modalComponentRefInstance.openModal();
		} else {
			modalComponentRefInstance.openModal(config);
		}

		this.setObserversAndStates(modalStateItem);
		modalStateItem.state.stateAfterOpened.next(null);

		modalComponentRefInstance.close
			.pipe(take(1))
			.subscribe(() => this._close(modalStateItem));

		return this.getReturnObj(modalStateItem);
	}

	private setObserversAndStates(modalStateItem: ModalStateItem): void {
		const stateAfterClosed = new Subject();
		const stateAfterOpened = new ReplaySubject(1);

		modalStateItem.state.stateAfterClosed = stateAfterClosed;
		modalStateItem.state.stateAfterOpened = stateAfterOpened;
		modalStateItem.obs.afterClosed$ = stateAfterClosed.pipe(take(1));
		modalStateItem.obs.afterOpened$ = stateAfterOpened.pipe(take(1));
	}
}
