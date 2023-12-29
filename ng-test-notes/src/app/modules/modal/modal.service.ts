import { Injectable, ComponentFactoryResolver, ComponentRef, Type, ApplicationRef, Injector, Inject } from '@angular/core';
import { ModalComponent } from './modal.component';
import { BehaviorSubject, ReplaySubject, Subject, take, tap } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { InternalModalConfig, ModalConfig, ModalRef, ModalStateItem } from './modal.models';
import { ModalModule } from './modal.module';

@Injectable({
	providedIn: ModalModule
})
export class ModalService {
	private _stateModals: BehaviorSubject<ModalStateItem[]> = new BehaviorSubject<ModalStateItem[]>([]);

  constructor(
    private readonly _componentFactoryResolver: ComponentFactoryResolver,
    private readonly _appRef: ApplicationRef,
    private readonly _injector: Injector,
		@Inject(DOCUMENT) private readonly _document: Document
  ) {

	}

  public open(component: Type<any>, config?: ModalConfig): ModalRef {
		const modal = this._getModal(component);

		// Если модальное окно уже создано
		if (modal !== null) {
			return this._open(modal, config);
		}

		return this._create(component, config);
  }

  private _closeAndDestroy(modalStateItem: ModalStateItem, dialogResult?: any): void {
		const modalComponentRefInstance = modalStateItem.modalComponentRef.instance;

		if (modalComponentRefInstance.isOpen === false) {
			this._destroy(modalStateItem, dialogResult);
			return;
		}

		modalComponentRefInstance.closeModal({ isDestroy: true, dialogResult });
  }

	private _destroy(modalStateItem: ModalStateItem, dialogResult?: any): void {
		modalStateItem.state.stateAfterClosed.next(dialogResult);
		this._appRef.detachView(modalStateItem.modalComponentRef.hostView);
		modalStateItem.modalComponentRef.destroy();
		this._deleteModal(modalStateItem);
	}

	private _close(modalStateItem: ModalStateItem, dialogResult?: any): void {
		const modalComponentRefInstance = modalStateItem.modalComponentRef.instance;

		modalComponentRefInstance.closeModal({ dialogResult, isDestroy: false });
	}

	private _getModal(component: Type<any>): ModalStateItem | null {
		const modals = this._stateModals.value;
		const findedModal = modals.find((modal) => modal.componentModalContent === component);

		if (findedModal === undefined) return null;

		return findedModal;
	}

	private _deleteModal(modalStateItem: ModalStateItem): void {
		const stateModalsArr = this._stateModals.value;
		const findedModalIdx = stateModalsArr.findIndex((modal) => modal.modalComponentRef === modalStateItem.modalComponentRef);

		if (findedModalIdx !== -1) {
			stateModalsArr.splice(findedModalIdx, 1);
		}

		this._stateModals.next(stateModalsArr);
	}

	private _getReturnObj(modalStateItem: ModalStateItem): ModalRef {
		return {
			afterClosed: () => modalStateItem.obs.afterClosed$,
			afterOpened: () => modalStateItem.obs.afterOpened$,
			close: (dialogResult?: any) => this._close(modalStateItem, dialogResult),
			open: (data?: any) => {
				const modalConfig: InternalModalConfig | null = modalStateItem.modalComponentRef.instance.modalConfig;
				if (modalConfig === null) return;
				modalConfig.data = data;
				this._open(modalStateItem, modalConfig);
			},
			destroy: (dialogResult?: any) => {
				this._closeAndDestroy(modalStateItem, dialogResult);
			}
		};
	}

	private _createModalStateItem(component: Type<any>, modalComponentRef: ComponentRef<ModalComponent>): ModalStateItem {
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
		const modalComponentRef = this._componentFactoryResolver.resolveComponentFactory(ModalComponent).create(this._injector);
		const modalStateItem = this._createModalStateItem(component, modalComponentRef);

		modalComponentRef.instance.close
			.pipe(
				take(1),
				tap(({ isDestroy, dialogResult }) => {
					if (isDestroy === true) {
						this._destroy(modalStateItem, dialogResult);
					} else {
						modalStateItem.state.stateAfterClosed.next(dialogResult);
					}
				})
			)
			.subscribe();

		const returnRef = this._getReturnObj(modalStateItem);

		modalComponentRef.instance.createAndOpenModal$({
			config: config,
			returnRef: returnRef,
			componentModalContent: component
		})
			.subscribe(() => {
				modalStateItem.state.stateAfterOpened.next(null);
			});

		this._appRef.attachView(modalComponentRef.hostView);
		this._document.body.appendChild(modalComponentRef.location.nativeElement);
		this._stateModals.next([...this._stateModals.value, modalStateItem]);

		return returnRef;
	}

	private _open(modalStateItem: ModalStateItem, config?: ModalConfig): ModalRef {
		const modalComponentRefInstance = modalStateItem.modalComponentRef.instance;

		this._setObserversAndStates(modalStateItem);
		modalComponentRefInstance.openModal$(config)
			.subscribe(() => {
				modalStateItem.state.stateAfterOpened.next(null);
			});

		modalComponentRefInstance.close
			.pipe(
				take(1),
				tap(({ isDestroy, dialogResult }) => {
					if (isDestroy === true) {
						this._destroy(modalStateItem, dialogResult);
					} else {
						modalStateItem.state.stateAfterClosed.next(dialogResult);
					}
				})
			)
			.subscribe();

		return this._getReturnObj(modalStateItem);
	}

	private _setObserversAndStates(modalStateItem: ModalStateItem): void {
		const stateAfterClosed = new Subject<any>();
		const stateAfterOpened = new ReplaySubject<any>(1);

		modalStateItem.state.stateAfterClosed = stateAfterClosed;
		modalStateItem.state.stateAfterOpened = stateAfterOpened;
		modalStateItem.obs.afterClosed$ = stateAfterClosed.pipe(take(1));
		modalStateItem.obs.afterOpened$ = stateAfterOpened.pipe(take(1));
	}
}
