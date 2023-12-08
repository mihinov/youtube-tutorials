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

	private secondsLeft: BehaviorSubject<number> = new BehaviorSubject(this.secondsLeftConst);
	private lastUrl: BehaviorSubject<string> = new BehaviorSubject('');
	public secondsLeft$: Observable<number> = this.secondsLeft.asObservable();
	public lastUrl$: Observable<string> = this.lastUrl.asObservable();
	public countDown$: Observable<number> = interval(1000).pipe(
		map((value) => this.secondsLeftConst - value - 1),
		takeWhile((value) => value >= 0),
		tap(count => {
			this.secondsLeft.next(count);
			if (count === 0) {
				this.router.navigate(['/'], { queryParamsHandling: 'preserve', preserveFragment: true});
			}
		}),
		takeUntilDestroyed()
	);

	constructor(
		private readonly router: Router,
		private readonly navigationErrorRouteService: NavigationErrorRouteService
	) { }

	ngOnInit(): void {
		this.countDown$.subscribe();

		const prevUrl = this.navigationErrorRouteService.getPreviousUrl();
		const host = window.location.host;

		this.lastUrl.next(`${host}${prevUrl}`);
	}
}
