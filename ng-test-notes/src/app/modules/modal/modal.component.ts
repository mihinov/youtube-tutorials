import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
    { provide: 'Window', useValue: window }
  ],
})
export class ModalComponent implements AfterViewInit {
	@Input() public componentModalContent: Type<any> | null = null;
	@ViewChild('modalContent', { read: ViewContainerRef }) vcrModalContent: ViewContainerRef | null = null;
	@Output() public close = new EventEmitter<void>();
	public element: HTMLElement;

	constructor(
		private readonly el: ElementRef,
		private readonly cdr: ChangeDetectorRef,
		@Inject(DOCUMENT) private readonly document: Document,
		@Inject('Window') private readonly window: Window
	) {
    this.element = this.el.nativeElement;

  }

	ngAfterViewInit(): void {
		this.renderModalContent();
	}

	public openModal(): void {
		const scrollbarWidth = this.getScrollbarWidth();

		this.document.body.style.paddingRight = `${scrollbarWidth} px`;
    this.document.body.classList.add('overflowYHidden');
		this.element.classList.add('modal_open');
		this.renderModalContent();
  }

  public closeModal(): void {
		this.document.body.removeAttribute('padding-right');
    this.document.body.classList.remove('overflowYHidden');
    this.element.classList.remove('modal_open');
		this.close.emit();
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
		const hasScrollbar = this.window.innerWidth > this.document.documentElement.clientWidth;

		// Возвращение ширины скроллбара, если он есть, иначе 0
		return hasScrollbar ? scrollbarWidth : 0;
	}

	private renderModalContent(): void {
		if (this.vcrModalContent === null) return;
		if (this.componentModalContent === null) return;

		this.vcrModalContent.clear();
    this.vcrModalContent.createComponent(this.componentModalContent);
		this.cdr.detectChanges();
	}

}
