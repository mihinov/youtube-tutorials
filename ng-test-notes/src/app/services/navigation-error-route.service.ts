import { Injectable } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { filter, tap, Subscription, BehaviorSubject, map, shareReplay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationErrorRouteService {

  private _statePrevMiniUrl: BehaviorSubject<string> = new BehaviorSubject('');
	private _prevMiniUrl$: Observable<string> = this.router.events
	.pipe(
		filter(event => event instanceof Scroll),
		tap((event: any) => {
			this._statePrevMiniUrl.next(event.routerEvent.url);
		}),
		map((event) => event.routerEvent.url as string),
		shareReplay(1)
	);
  private _subs: Subscription;
	public prevUrl$: Observable<string> = this._prevMiniUrl$.pipe(
		map((prevMiniUrl) => `${window.location.host}${prevMiniUrl}`),
		shareReplay(1)
	);

  constructor(
		private readonly router: Router
	) {
		this._subs = this._prevMiniUrl$.subscribe();
	}

  public destroy(): void {
    this._subs.unsubscribe();
  }
}
