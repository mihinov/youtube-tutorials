import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Injector, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { CloseModalInputArgs, InternalModalConfig, ModalConfig, ModalRef } from './modal.models';
import { MODAL_DATA, MODAL_REF } from './modal.tokens';
import { Observable, ReplaySubject, filter, map, of, shareReplay, switchMap, take, tap, timer } from 'rxjs';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ModalComponent implements AfterViewInit {
	public modalConfig: InternalModalConfig | null = null;
	public isOpen: boolean = false;
	public componentModalContent: Type<any> | null = null;
	@Output() public close = new EventEmitter<CloseModalInputArgs>();
	@ViewChild('modalContent', { read: ViewContainerRef }) private _vcrModalContent!: ViewContainerRef;
	private _afterViewInit$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
	private _isPointerUp: boolean = false;
	private _isPointerDown: boolean = false;

	constructor(
		private readonly _cdr: ChangeDetectorRef,
		@Inject(DOCUMENT) private readonly _document: Document,
		private readonly _injector: Injector
	) {
  }

	ngAfterViewInit(): void {
		this._afterViewInit$.next(true);
	}

	public createAndOpenModal$(
		{config, returnRef, componentModalContent}: { config?: ModalConfig, returnRef: ModalRef, componentModalContent: Type<any> }
	): Observable<number> {
		this.componentModalContent = componentModalContent;
		const modalConfig = this._createConfig(config);

		return this._afterViewInit$
			.pipe(
				take(1),
				tap(() => this._createModalContent(returnRef, componentModalContent, modalConfig)),
				switchMap(() => this.openModal$(modalConfig)),
				shareReplay(1)
			);
  }

	public openModal$(config?: ModalConfig): Observable<number> {
		this.modalConfig = this._createConfig(config);
    this._document.body.classList.add('overflowHidden');
		this._document.addEventListener('keydown', this._escFn);
		this.isOpen = true;
		this._cdr.detectChanges();

		return timer(this.modalConfig.transitionDuration)
			.pipe(
				take(1),
				shareReplay(1)
			);
	}

	public pointerUp(event: PointerEvent): void {
		if (event.target === null) return;
		const targetNode: HTMLElement = event.target as HTMLElement;

		if (targetNode.classList.contains('modal__body') || targetNode.closest('.modal__close') !== null) {
			this._isPointerUp = true;
		}

		if (this._isPointerUp === true && this._isPointerDown === true) {
			this.closeModal();
		}

		this._isPointerUp = false;
		this._isPointerDown = false;
	}

	public pointerDown(event: PointerEvent): void {
		if (event.target === null) return;
		if (event.button === 2) return; // Если правая кнопка мыши
		const targetNode: HTMLElement = event.target as HTMLElement;

		if (targetNode.classList.contains('modal__body') || targetNode.closest('.modal__close') !== null) {
			this._isPointerDown = true;
		}
	}

	public closeModal({ isDestroy, dialogResult }: CloseModalInputArgs = { isDestroy: false }): void {
		if (this.modalConfig === null) return;

		this._closeModalCss();

		timer(this.modalConfig.transitionDuration)
			.pipe(
				take(1),
				tap(() => {
					this.close.emit({ isDestroy, dialogResult });
				})
			)
			.subscribe();
	}

	private _escFn = (event: KeyboardEvent): void => {
		if (event.key === 'Escape') {
			this.closeModal();
		}
	}

	private _closeModalCss(): void {
		this._document.body.style.removeProperty('padding-right');
    this._document.body.classList.remove('overflowHidden');
		this._document.removeEventListener('keydown', this._escFn);
		this.isOpen = false;
		this._cdr.detectChanges();
	}

	private _createModalContent(returnRef: ModalRef, componentModalContent: Type<any>, modalConfig: InternalModalConfig): void {
		this._vcrModalContent.clear();
    this._vcrModalContent.createComponent(componentModalContent, {
			injector: Injector.create({
				parent: this._injector,
				providers: [
					{ provide: MODAL_DATA, useValue: modalConfig?.data },
					{ provide: MODAL_REF, useValue: returnRef }
				]
			}),
		});

		this._cdr.detectChanges();
	}

	private _createConfig(config?: ModalConfig): InternalModalConfig {
    const defaultTransitionDuration = this._getTransitionDuration();

		if (config === undefined) return {
			transitionDuration: defaultTransitionDuration
		};

    const resultConfig: InternalModalConfig = {
			...config,
      transitionDuration: config.transitionDuration === undefined ? defaultTransitionDuration : config.transitionDuration
    };

    return resultConfig;
	}

	private _getTransitionDuration(): number {
		const defaultDuration = 200;

		if (!this._document.documentElement.computedStyleMap) return defaultDuration;

		const transitionDurationProp = this._document.documentElement.computedStyleMap().get('--transitionDurationMS') as (CSSUnitValue | null);
		if (transitionDurationProp === null) return defaultDuration;
		const transitionDuration = transitionDurationProp.value || defaultDuration;

		return transitionDuration;
	}

}
