import {
	Directive,
	Input,
	TemplateRef,
	ViewContainerRef,
	OnDestroy,
	ComponentRef,
	inject,
	ElementRef,
	Renderer2,
	EmbeddedViewRef
} from '@angular/core';
import { isObservable, from, Subscription, Observable, of, map } from 'rxjs';
import { SpinnerComponent } from '../component-spinner/spinner.component';

type Boolish = boolean | null | undefined;
type LoadingInput = Boolish | Promise<Boolish> | Observable<Boolish>;

@Directive({
	selector: '[loading]'
})
export class LoadingDirective implements OnDestroy {
	private _subscription?: Subscription;

	// Разделяем спиннеры для структурного и атрибутного режимов
	private _structuralSpinnerRef?: ComponentRef<SpinnerComponent>;
	private _attributeSpinnerRef?: ComponentRef<SpinnerComponent>;
	private _contentView?: EmbeddedViewRef<any>;
	private _isSpinnerShown = false;

	private _vcr = inject(ViewContainerRef);
	private _tpl = inject<TemplateRef<any> | null>(TemplateRef, { optional: true });
	private _el = inject<ElementRef<HTMLElement> | null>(ElementRef, { optional: true });
	private _renderer = inject(Renderer2);

	@Input('loading') set loading(value: LoadingInput) {
		this._clearSub();

		const obs$ = this._toObservable(value);
		this._subscription = obs$.subscribe(isLoading => {
			if (this._tpl) {
				this._updateStructuralView(isLoading);
			} else {
				this._updateAttributeView(isLoading);
			}
		});
	}

	private _toObservable(value: LoadingInput): Observable<boolean> {
		if (isObservable(value)) return value.pipe(map(v => !!v));
		if (value instanceof Promise) return from(value).pipe(map(v => !!v));
		return of(!!value);
	}

	// ===== Структурный режим (*loading) =====
	private _updateStructuralView(isLoading: boolean) {
		if (!this._structuralSpinnerRef) {
			this._structuralSpinnerRef = this._vcr.createComponent(SpinnerComponent);
			const idx = this._vcr.indexOf(this._structuralSpinnerRef.hostView);
			if (idx > -1) this._vcr.detach(idx);
		}

		if (!this._contentView) {
			this._contentView = this._tpl!.createEmbeddedView({});
			this._vcr.insert(this._contentView);
		}

		if (isLoading && !this._isSpinnerShown) {
			this._vcr.detach(this._vcr.indexOf(this._contentView)!);
			this._vcr.insert(this._structuralSpinnerRef.hostView);
			this._isSpinnerShown = true;
		} else if (!isLoading && this._isSpinnerShown) {
			this._vcr.detach(this._vcr.indexOf(this._structuralSpinnerRef.hostView)!);
			this._vcr.insert(this._contentView);
			this._isSpinnerShown = false;
		}
	}

	// ===== Атрибутный режим ([loading]) =====
	private _updateAttributeView(isLoading: boolean) {
		if (!this._el) return;

		if (isLoading) {
			this._renderer.setStyle(this._el.nativeElement, 'display', 'none');
			if (!this._attributeSpinnerRef) {
				this._attributeSpinnerRef = this._vcr.createComponent(SpinnerComponent);
			}
		} else {
			this._renderer.removeStyle(this._el.nativeElement, 'display');
			this._attributeSpinnerRef?.destroy();
			this._attributeSpinnerRef = undefined;
		}
	}

	private _clearSub() {
		this._subscription?.unsubscribe();
		this._subscription = undefined;
	}

	ngOnDestroy() {
		this._clearSub();

		this._structuralSpinnerRef?.destroy();
		this._structuralSpinnerRef = undefined;

		this._attributeSpinnerRef?.destroy();
		this._attributeSpinnerRef = undefined;

		this._contentView?.destroy();
		this._contentView = undefined;

		if (this._el) this._renderer.removeStyle(this._el.nativeElement, 'display');
	}
}
