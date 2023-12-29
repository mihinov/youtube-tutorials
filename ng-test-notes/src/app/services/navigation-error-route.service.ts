import { Injectable } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { filter, tap, Subscription, BehaviorSubject, map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationErrorRouteService {

  private _statePrevMiniUrl = new BehaviorSubject('');
	private _prevMiniUrl$ = this.router.events
	.pipe(
		filter(event => event instanceof Scroll),
		tap((event: any) => {
			this._statePrevMiniUrl.next(event.routerEvent.url);
		}),
		map((event) => event.routerEvent.url as string),
		shareReplay(1)
	);
  private _subs: Subscription;
	public prevUrl$ = this._prevMiniUrl$.pipe(
		map((prevMiniUrl) => `${window.location.host}${prevMiniUrl}`),
		shareReplay(1)
	);

  constructor(
		private readonly router: Router
	) {
		this._subs = this._prevMiniUrl$.subscribe()
	}

  public destroy(): void {
    this._subs.unsubscribe();
  }
}
