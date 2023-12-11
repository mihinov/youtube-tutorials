import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Injector, Input, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { InternalModalConfig, ModalRef } from './modal.models';
import { MODAL_DATA, MODAL_REF } from './modal.tokens';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements AfterViewInit {
	public modalConfig: InternalModalConfig | null = null;
	@Input() public componentModalContent: Type<any> | null = null;
	@Output() public close = new EventEmitter<void>();
	@ViewChild('modalContent', { read: ViewContainerRef }) private vcrModalContent: ViewContainerRef | null = null;
	@ViewChild('modalRef', { static: false }) private modalRef: ElementRef<HTMLDivElement> | null = null;
	private element: HTMLElement;
	private returnRef: ModalRef | null = null;

	constructor(
		private readonly el: ElementRef,
		private readonly cdr: ChangeDetectorRef,
		@Inject(DOCUMENT) private readonly document: Document,
		private readonly injector: Injector
	) {
    this.element = this.el.nativeElement;
  }

	ngAfterViewInit(): void {
		this.renderModalContent();

		if (this.modalRef === null) return;
		if (this.modalConfig === null) return;
	}

	public createAndOpenModal(config: InternalModalConfig, returnRef: ModalRef): void {
		this.openModal(config, returnRef);
		this.renderModalContent();
  }

	public openModal(config: InternalModalConfig, returnRef: ModalRef): void {
		const scrollbarWidth = this.getScrollbarWidth();

		this.returnRef = returnRef;
		this.modalConfig = config;
		if (scrollbarWidth !== 0) this.document.body.style.paddingRight = `${scrollbarWidth}px`;
    this.document.body.classList.add('overflowHidden');
		this.el.nativeElement.style.transitionDuration = `${this.modalConfig.transitionDurationS}s`;
		this.element.classList.add('modal_open');
	}

	public clickModal(event: any): void {
		// Если это отжатие мыши, то закончить
		const pointerEvent: PointerEvent = event;
		if (pointerEvent.target === null) return;
		const targetNode: HTMLElement = pointerEvent.target as HTMLElement;

		if (targetNode.classList.contains('modal__body') || targetNode.closest('.modal__close') !== null) {
			this.close.emit();
		}
	}

	public closeModal(): void {
		this.document.body.style.removeProperty('padding-right');
    this.document.body.classList.remove('overflowHidden');
    this.element.classList.remove('modal_open');
  }

	private getScrollbarWidth(): number {
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

	private renderModalContent(): void {
		if (this.vcrModalContent === null) return;
		if (this.componentModalContent === null) return;
		if (this.returnRef === null) return;
		if (this.modalConfig === null) return;

		this.vcrModalContent.clear();
    this.vcrModalContent.createComponent(this.componentModalContent, {
			injector: Injector.create({
				parent: this.injector,
				providers: [
					{ provide: MODAL_DATA, useValue: this.modalConfig?.data },
					{ provide: MODAL_REF, useValue: this.returnRef }
				]
			}),
		});

		this.cdr.detectChanges();
	}

}
