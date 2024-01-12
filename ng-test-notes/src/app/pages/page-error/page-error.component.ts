import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationErrorRouteService } from '../../services/navigation-error-route.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, interval, map, takeWhile, tap, BehaviorSubject } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-page-error',
  templateUrl: './page-error.component.html',
  styleUrl: './page-error.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageErrorComponent {
  private readonly secondsLeftConst: number = 5;

	private secondsLeftState: BehaviorSubject<number> = new BehaviorSubject(this.secondsLeftConst);
	public secondsLeft$: Observable<number> = this.secondsLeftState.asObservable();
	public prevUrl$: Observable<string> = this._navigationErrorRouteService.prevUrl$;
	public countDown$: Observable<number> = interval(1000).pipe(
		map((value) => this.secondsLeftConst - value - 1),
		takeWhile((value) => value >= 0),
		tap(count => {
			this.secondsLeftState.next(count);
			if (count === 0) {
				this._router.navigate( ['/'], { queryParamsHandling: 'preserve', preserveFragment: true} );
			}
		}),
		takeUntilDestroyed()
	);

	constructor(
		private readonly _router: Router,
		private readonly _navigationErrorRouteService: NavigationErrorRouteService
	) { }

	ngOnInit(): void {
		this.countDown$.subscribe();
	}
}
