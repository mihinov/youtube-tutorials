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
	private afterViewInit$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

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
		this.modalConfig = this.createConfig(config);
		const scrollbarWidth = this._getScrollbarWidth();

		if (scrollbarWidth !== 0) this.document.body.style.paddingRight = `${scrollbarWidth}px`;
    this.document.body.classList.add('overflowHidden');
		this.document.addEventListener('keydown', this.escFn);
		this.isOpen = true;
		this.cdr.detectChanges();
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

	private escFn = (event: KeyboardEvent): void => {
		if (event.key === 'Escape') {
			this._closeModal();
		}
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
		this.document.body.style.removeProperty('padding-right');
    this.document.body.classList.remove('overflowHidden');
		this.document.removeEventListener('keydown', this.escFn);
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

	private createConfig(config?: ModalConfig): InternalModalConfig {
    const defaultTransitionDuration = this.getTransitionDuration();

		if (config === undefined) return {
			transitionDurationS: defaultTransitionDuration
		};

    const resultConfig: InternalModalConfig = {
			...config,
      transitionDurationS: config.transitionDurationS === undefined ? defaultTransitionDuration : config.transitionDurationS
    };

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
