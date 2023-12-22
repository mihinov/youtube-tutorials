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
  private modalComponentRef: ComponentRef<ModalComponent> | null = null;
	private stateAfterClosed: Subject<any> = new Subject<any>();
	private stateAfterOpened: Subject<any> = new ReplaySubject<any>(1);
	private afterClosed$: Observable<any> = this.stateAfterClosed.pipe(take(1));
	private afterOpened$: Observable<any> = this.stateAfterOpened.pipe(take(1));
	private returnRef: ModalRef | null = null;
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

		console.log('destroy');

		animationEnd$
			.pipe(take(1))
			.subscribe(() => this._destroy(modalStateItem));
  }

	private _destroy(modalStateItem: ModalStateItem): void {
		this.stateAfterClosed.next(null);
		this.appRef.detachView(modalStateItem.modalComponentRef.hostView);
		modalStateItem.modalComponentRef.destroy();
		this.deleteModal(modalStateItem);
	}

	private _close(modalStateItem: ModalStateItem): void {
		this.stateAfterClosed.next(null);
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
			afterClosed: () => this.afterClosed$,
			afterOpened: () => this.afterOpened$,
			close: () => this._close(modalStateItem),
			destroy: () => this.closeAndDestroy(modalStateItem),
			open: () => this._open(modalStateItem)
		};
	}

	private _create(component: Type<any>, config?: ModalConfig): ModalRef {
		this.modalComponentRef = this.componentFactoryResolver.resolveComponentFactory(ModalComponent).create(this.injector);

		const modalStateItem: ModalStateItem = {
			id: window.crypto.randomUUID(),
			componentModalContent: component,
			modalComponentRef: this.modalComponentRef
		};

		this.modalComponentRef.instance.close
			.pipe(take(1))
			.subscribe(() => this._close(modalStateItem));

		this.setObserversAndStates();
		this.stateAfterOpened.next(null);
		this.returnRef = this.getReturnObj(modalStateItem);

		if (config === undefined) {
			this.modalComponentRef.instance.createAndOpenModal({
				returnRef: this.returnRef,
				componentModalContent: component
			});
		} else {
			this.modalComponentRef.instance.createAndOpenModal({
				config: config,
				returnRef: this.returnRef,
				componentModalContent: component
			});
		}

		this.appRef.attachView(this.modalComponentRef.hostView);
		this.document.body.appendChild(this.modalComponentRef.location.nativeElement);

		this.stateModals.next([...this.stateModals.value, modalStateItem]);
		console.log(this.stateModals.value);

		return this.returnRef;
	}

	private _open(modalStateItem: ModalStateItem, config?: ModalConfig): ModalRef {
		if (this.modalComponentRef !== null && this.returnRef !== null) {

			if (config === undefined) {
				this.modalComponentRef.instance.openModal();
			} else {
				this.modalComponentRef.instance.openModal(config);
			}

			this.setObserversAndStates();
			this.stateAfterOpened.next(null);

			this.modalComponentRef.instance.close
				.pipe(take(1))
				.subscribe(() => this._close(modalStateItem));

		}

		return this.getReturnObj(modalStateItem);
	}

	private setObserversAndStates(): void {
		this.stateAfterClosed = new Subject();
		this.stateAfterOpened = new ReplaySubject(1);
		this.afterClosed$ = this.stateAfterClosed.pipe(take(1));
		this.afterOpened$ = this.stateAfterOpened.pipe(take(1));
	}
}
