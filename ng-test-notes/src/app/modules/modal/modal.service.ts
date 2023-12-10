import { Injectable, ComponentFactoryResolver, ComponentRef, Type, ApplicationRef, Injector, Inject, NgModule } from '@angular/core';
import { ModalComponent } from './modal.component';
import { Observable, ReplaySubject, Subject, take, timer } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { InternalModalConfig, ModalConfig } from './modal.models';
import { ModalModule } from './modal.module';
import { MODAL_DATA } from './modal.tokens';

@Injectable({
  providedIn: ModalModule
})
export class ModalService {
  private modalComponentRef: ComponentRef<ModalComponent> | null = null;
	private defaultConfig: ModalConfig = {
		maxWidth: 1000,
		minWidth: 200
	};
	private currentConfig: InternalModalConfig | null = null;
	private stateAfterClosed: Subject<any> = new Subject<any>();
	private stateAfterOpened: Subject<any> = new ReplaySubject<any>(1);
	private afterClosed$: Observable<any> = this.stateAfterClosed.pipe(take(1));
	private afterOpened$: Observable<any> = this.stateAfterOpened.pipe(take(1));

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly appRef: ApplicationRef,
    private readonly injector: Injector,
		@Inject(DOCUMENT) private readonly document: Document
  ) {

	}

  public open(component: Type<any>, config: ModalConfig = this.defaultConfig) {
		this.currentConfig = this.createConfig(config);
		this.modalComponentRef = this.componentFactoryResolver.resolveComponentFactory(ModalComponent).create(this.injector);
		this.appRef.attachView(this.modalComponentRef.hostView);
		this.document.body.appendChild(this.modalComponentRef.location.nativeElement);

    this.modalComponentRef.instance.componentModalContent = component;
		this.modalComponentRef.instance.openModal(this.currentConfig);
		this.modalComponentRef.instance.close
			.pipe(take(1))
			.subscribe(() => this.close());

		this.setObserversAndStates();
		this.stateAfterOpened.next(null);

		return {
			afterClosed: () => this.afterClosed$,
			afterOpened: () => this.afterOpened$
		}
  }

  public close(): void {
		if (this.modalComponentRef === null) return;
		if (this.currentConfig === null) return;

		timer(this.currentConfig.transitionDurationS * 1000)
		.pipe(take(1))
		.subscribe(() => {
			if (this.modalComponentRef === null) return;

			this.stateAfterClosed.next(null);
			this.appRef.detachView(this.modalComponentRef.hostView);
			this.modalComponentRef.destroy();
			this.modalComponentRef = null;
		});
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

	private setObserversAndStates(): void {
		this.stateAfterClosed = new Subject();
		this.stateAfterOpened = new ReplaySubject(1);
		this.afterClosed$ = this.stateAfterClosed.pipe(take(1));
		this.afterOpened$ = this.stateAfterOpened.pipe(take(1));
	}
}
