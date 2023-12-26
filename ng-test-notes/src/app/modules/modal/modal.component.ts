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
})
export class ModalComponent implements AfterViewInit {
	public modalConfig: InternalModalConfig | null = null;
	public isOpen: boolean = false;
	public componentModalContent: Type<any> | null = null;
	@Output() public close = new EventEmitter<CloseModalInputArgs>();
	@ViewChild('modalContent', { read: ViewContainerRef }) private vcrModalContent!: ViewContainerRef;
	private afterViewInit$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
	private isPointerUp: boolean = false;
	private isPointerDown: boolean = false;

	constructor(
		private readonly cdr: ChangeDetectorRef,
		@Inject(DOCUMENT) private readonly document: Document,
		private readonly injector: Injector
	) {
  }

	ngAfterViewInit(): void {
		this.afterViewInit$.next(true);
	}

	public createAndOpenModal$(
		{config, returnRef, componentModalContent}: { config?: ModalConfig, returnRef: ModalRef, componentModalContent: Type<any> }
	): Observable<number> {
		this.componentModalContent = componentModalContent;
		const modalConfig = this.createConfig(config);

		return this.afterViewInit$
			.pipe(
				take(1),
				tap(() => this._createModalContent(returnRef, componentModalContent, modalConfig)),
				switchMap(() => this.openModal$(modalConfig)),
				shareReplay(1)
			);
  }

	public openModal$(config?: ModalConfig): Observable<number> {
		this.modalConfig = this.createConfig(config);
		const scrollbarWidth = this._getScrollbarWidth();

		if (scrollbarWidth !== 0) this.document.body.style.paddingRight = `${scrollbarWidth}px`;
    this.document.body.classList.add('overflowHidden');
		this.document.addEventListener('keydown', this.escFn);
		this.isOpen = true;
		this.cdr.detectChanges();

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
			this.isPointerUp = true;
		}

		if (this.isPointerUp === true && this.isPointerDown === true) {
			this.closeModal();
		}

		this.isPointerUp = false;
		this.isPointerDown = false;
	}

	public pointerDown(event: PointerEvent): void {
		if (event.target === null) return;
		const targetNode: HTMLElement = event.target as HTMLElement;

		if (targetNode.classList.contains('modal__body') || targetNode.closest('.modal__close') !== null) {
			this.isPointerDown = true;
		}
	}

	public clickModal(event: PointerEvent): void {
		if (event.target === null) return;
		const targetNode: HTMLElement = event.target as HTMLElement;

		if (targetNode.classList.contains('modal__body') || targetNode.closest('.modal__close') !== null) {
			this.closeModal();
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

	private escFn = (event: KeyboardEvent): void => {
		if (event.key === 'Escape') {
			this.closeModal();
		}
	}

	private _closeModalCss(): void {
		this.document.body.style.removeProperty('padding-right');
    this.document.body.classList.remove('overflowHidden');
		this.document.removeEventListener('keydown', this.escFn);
		this.isOpen = false;
		this.cdr.detectChanges();
	}

	private _getScrollbarWidth(): number {
		// Создание элемента для проверки наличия прокрутки
		const scrollDiv = this.document.createElement('div');
		scrollDiv.style.width = '100px';
		scrollDiv.style.height = '100px';
		scrollDiv.style.overflow = 'scroll';
		scrollDiv.style.position = 'absolute';
		scrollDiv.style.top = '-9999px';
		scrollDiv.style.opacity = '0';
		this.document.body.appendChild(scrollDiv);

		// Вычисление ширины скроллбара при наличии прокрутки
		const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

		// Удаление временного элемента
		this.document.body.removeChild(scrollDiv);

		// Проверка наличия прокрутки на данный момент
		const hasScrollbar = window.innerWidth > this.document.documentElement.clientWidth;

		// Возвращение ширины скроллбара, если он есть, иначе 0
		return hasScrollbar ? scrollbarWidth : 0;
	}

	private _createModalContent(returnRef: ModalRef, componentModalContent: Type<any>, modalConfig: InternalModalConfig): void {
		this.vcrModalContent.clear();
    this.vcrModalContent.createComponent(componentModalContent, {
			injector: Injector.create({
				parent: this.injector,
				providers: [
					{ provide: MODAL_DATA, useValue: modalConfig?.data },
					{ provide: MODAL_REF, useValue: returnRef }
				]
			}),
		});

		this.cdr.detectChanges();
	}

	private createConfig(config?: ModalConfig): InternalModalConfig {
    const defaultTransitionDuration = this.getTransitionDuration();

		if (config === undefined) return {
			transitionDuration: defaultTransitionDuration
		};

    const resultConfig: InternalModalConfig = {
			...config,
      transitionDuration: config.transitionDuration === undefined ? defaultTransitionDuration : config.transitionDuration
    };

    return resultConfig;
	}

	private getTransitionDuration(): number {
		const defaultDuration = 200;

		if (!this.document.documentElement.computedStyleMap) return defaultDuration;

		const transitionDurationProp = this.document.documentElement.computedStyleMap().get('--transitionDurationMS') as (CSSUnitValue | null);
		if (transitionDurationProp === null) return defaultDuration;
		const transitionDuration = transitionDurationProp.value || defaultDuration;

		return transitionDuration;
	}

}
