import { Injectable, ComponentFactoryResolver, ComponentRef, Type, ApplicationRef, Injector, Inject } from '@angular/core';
import { ModalComponent } from './modal.component';
import { Observable, ReplaySubject, Subject, take, timer } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { InternalModalConfig, ModalConfig } from './modal.models';
import { ModalModule } from './modal.module';

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
	private afterClosed$: Observable<any> = this.stateAfterClosed.asObservable();
	private afterOpened$: Observable<any> = this.stateAfterOpened.asObservable();

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly appRef: ApplicationRef,
    private readonly injector: Injector,
		@Inject(DOCUMENT) private readonly document: Document
  ) {

	}

  public open(component: Type<any>, config: ModalConfig = this.defaultConfig) {
		// Если модальное окно уже создано
		if (this.modalComponentRef?.instance.componentModalContent === component) {
			return this._open(config);
		}

		return this._create(component, config);
  }

  private closeAndDestroy(): void {
		if (this.modalComponentRef === null) return;
		if (this.currentConfig === null) return;

		this.modalComponentRef.instance.closeModal();
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

	private _close() {
		if (this.modalComponentRef === null) return;
		if (this.currentConfig === null) return;

		this.modalComponentRef.instance.closeModal();
		timer(this.currentConfig.transitionDurationS * 1000)
		.pipe(take(1))
		.subscribe(() => {
			if (this.modalComponentRef === null) return;

			this.stateAfterClosed.next(null);
		});
	}

	private _create(component: Type<any>, config: ModalConfig) {
		this.currentConfig = this.createConfig(config);
		this.modalComponentRef = this.componentFactoryResolver.resolveComponentFactory(ModalComponent).create(this.injector);
		this.appRef.attachView(this.modalComponentRef.hostView);
		this.document.body.appendChild(this.modalComponentRef.location.nativeElement);

    this.modalComponentRef.instance.componentModalContent = component;
		this.modalComponentRef.instance.createAndOpenModal(this.currentConfig);
		this.modalComponentRef.instance.close
			.pipe(take(1))
			.subscribe(() => this._close());

		this.setObserversAndStates();
		this.stateAfterOpened.next(null);

		return this.getReturnObj();
	}

	private getReturnObj() {
		return {
			afterClosed: () => this.afterClosed$,
			afterOpened: () => this.afterOpened$,
			close: () => this._close(),
			destroy: () => this.closeAndDestroy(),
			open: () => this._open(this.currentConfig)
		}
	}

	private _open(config: ModalConfig | null) {
		if (this.modalComponentRef !== null && config !== null) {
			this.currentConfig = this.createConfig(config);
			this.modalComponentRef.instance.openModal(this.currentConfig);
			this.setObserversAndStates();
			this.stateAfterOpened.next(null);

			this.modalComponentRef.instance.close
				.pipe(take(1))
				.subscribe(() => this._close());

		}

		return this.getReturnObj();
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
		this.afterClosed$ = this.stateAfterClosed.asObservable();
		this.afterOpened$ = this.stateAfterOpened.asObservable();
	}
}
