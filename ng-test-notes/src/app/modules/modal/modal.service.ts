import { Injectable, ComponentFactoryResolver, ComponentRef, Type, ApplicationRef, Injector, Inject } from '@angular/core';
import { ModalComponent } from './modal.component';
import { take, timer } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalComponentRef: ComponentRef<ModalComponent> | null = null;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly appRef: ApplicationRef,
    private readonly injector: Injector,
		@Inject(DOCUMENT) private readonly document: Document
  ) {

	}

  public open<T>(component: Type<T>): void {
    if (this.modalComponentRef === null) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);

      this.modalComponentRef = componentFactory.create(this.injector);
      this.appRef.attachView(this.modalComponentRef.hostView);
      this.document.body.appendChild(this.modalComponentRef.location.nativeElement);
    }

    this.modalComponentRef.instance.componentModalContent = component;
		this.modalComponentRef.instance.openModal();
		this.modalComponentRef.instance.close
			.pipe(take(1))
			.subscribe(() => this.close());
  }

  public close(): void {
		if (this.modalComponentRef === null) return;

		const transitionDurationProp = document.documentElement.computedStyleMap().get('--transitionDurationS') as CSSUnitValue;
		const transitionDuration = transitionDurationProp.value || 0.2;

		timer(transitionDuration * 1000)
		.pipe(take(1))
		.subscribe(() => {
			if (this.modalComponentRef === null) return;

			this.modalComponentRef.instance.closeModal();
			this.appRef.detachView(this.modalComponentRef.hostView);
			this.modalComponentRef.destroy();
			this.modalComponentRef = null;
		});
  }
}
