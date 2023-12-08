import { Injectable } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { filter, tap, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationErrorRouteService {

  private prevUrl: string = '';
	private prevUrl$ = 	this.router.events
	.pipe(
		filter(event => event instanceof Scroll),
		tap((event: any) => {
			this.prevUrl = event.routerEvent.url;
		})
	);
  private subs: Subscription = this.prevUrl$.subscribe();

  constructor(
		private readonly router: Router
	) {}

	public getPreviousUrl(): string {
    return this.prevUrl;
  }

  public destroy(): void {
    this.subs.unsubscribe();
  }
}
