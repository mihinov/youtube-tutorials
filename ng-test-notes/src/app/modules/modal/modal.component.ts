import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Injector, Input, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { InternalModalConfig, ModalConfig, ModalRef } from './modal.models';
import { MODAL_DATA, MODAL_REF } from './modal.tokens';
import { ReplaySubject, shareReplay, take, timer } from 'rxjs';

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
	@Output() public close = new EventEmitter<void>();
	@ViewChild('modalContent', { read: ViewContainerRef }) private vcrModalContent!: ViewContainerRef;
	@ViewChild('modalRef', { static: false }) private modalHtml!: ElementRef<HTMLDivElement>;
	private afterViewInit$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
	private defaultConfig: ModalConfig = {
		maxWidth: 1000,
		minWidth: 200
	};

	constructor(
		private readonly cdr: ChangeDetectorRef,
		@Inject(DOCUMENT) private readonly document: Document,
		private readonly injector: Injector
	) {
  }

	ngAfterViewInit(): void {
		this.afterViewInit$.next(true);
	}

	public createAndOpenModal({config, returnRef, componentModalContent}: { config?: ModalConfig, returnRef: ModalRef, componentModalContent: Type<any> }): void {
		this.componentModalContent = componentModalContent;

		this.afterViewInit$
			.pipe(take(1))
			.subscribe(() => {
				this._createModalContent(returnRef);
				this.openModal(config);
			});
  }

	public openModal(config?: ModalConfig): void {
		if (this.modalHtml === null) return;
		if (config === undefined) config = this.defaultConfig;

		this.modalConfig = this.createConfig(config);
		const scrollbarWidth = this._getScrollbarWidth();

		if (scrollbarWidth !== 0) this.document.body.style.paddingRight = `${scrollbarWidth}px`;
    this.document.body.classList.add('overflowHidden');
		this.modalHtml.nativeElement.style.transitionDuration = `${this.modalConfig.transitionDurationS}s`;
		this.modalHtml.nativeElement.classList.add('modal_open');
		this.isOpen = true;
	}

	public clickModal(event: any): void {
		// Если это отжатие мыши, то закончить
		const pointerEvent: PointerEvent = event;
		if (pointerEvent.target === null) return;
		const targetNode: HTMLElement = pointerEvent.target as HTMLElement;

		if (targetNode.classList.contains('modal__body') || targetNode.closest('.modal__close') !== null) {
			this._closeModal();
		}
	}

	public closeModal() {
		if (this.modalConfig === null) return null;

		this._closeModalCss();

		return timer(this.modalConfig.transitionDurationS * 1000)
			.pipe(
				take(1),
				shareReplay(1)
			);
	}

	private _closeModal(): void {
		if (this.modalConfig === null) return;

		this._closeModalCss();

		timer(this.modalConfig.transitionDurationS * 1000)
			.pipe(take(1))
			.subscribe(() => {
				this.close.emit();
			});
  }

	private _closeModalCss(): void {
		if (this.modalHtml === null) return;
		this.document.body.style.removeProperty('padding-right');
    this.document.body.classList.remove('overflowHidden');
    this.modalHtml.nativeElement.classList.remove('modal_open');
		this.isOpen = false;
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

	private _createModalContent(returnRef: ModalRef): void {
		if (this.componentModalContent === null) return;

		this.vcrModalContent.clear();
    this.vcrModalContent.createComponent(this.componentModalContent, {
			injector: Injector.create({
				parent: this.injector,
				providers: [
					{ provide: MODAL_DATA, useValue: this.modalConfig?.data },
					{ provide: MODAL_REF, useValue: returnRef }
				]
			}),
		});

		this.cdr.detectChanges();
	}

	private createConfig(config: ModalConfig): InternalModalConfig {
    const transitionDuration = this.getTransitionDuration();
    const defaultMaxWidth = 1000;
    const defaultMinWidth = 200;

    const resultConfig: InternalModalConfig = {
        maxWidth: config.maxWidth !== undefined ? config.maxWidth : defaultMaxWidth,
        minWidth: config.minWidth !== undefined ? config.minWidth : defaultMinWidth,
        transitionDurationS: config.transitionDurationS !== undefined ? config.transitionDurationS : transitionDuration
    };

    if (config.data !== undefined) resultConfig.data = config.data;

    return resultConfig;
	}

	private getTransitionDuration(): number {
		const defaultDuration = 0.2;

		if (!this.document.documentElement.computedStyleMap) return defaultDuration;

		const transitionDurationProp = this.document.documentElement.computedStyleMap().get('--transitionDurationS') as (CSSUnitValue | null);
		if (transitionDurationProp === null) return defaultDuration;
		const transitionDuration = transitionDurationProp.value || defaultDuration;

		return transitionDuration;
	}



}
