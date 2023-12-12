import { Injectable } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { filter, tap, Subscription, BehaviorSubject, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationErrorRouteService {

  private statePrevMiniUrl = new BehaviorSubject('');
	private prevMiniUrl$ = this.router.events
	.pipe(
		filter(event => event instanceof Scroll),
		tap((event: any) => {
			this.statePrevMiniUrl.next(event.routerEvent.url);
		}),
		map((event) => event.routerEvent.url as string)
	);
  private subs: Subscription;
	public prevUrl$ = this.prevMiniUrl$.pipe(
		map((prevMiniUrl) => `${window.location.host}${prevMiniUrl}`),
	);

  constructor(
		private readonly router: Router
	) {
		this.subs = this.prevMiniUrl$.subscribe()
	}

  public destroy(): void {
    this.subs.unsubscribe();
  }
}
