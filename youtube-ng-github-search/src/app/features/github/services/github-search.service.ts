import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RepoSearchItem, RepoSearchParams, RepoSearchResponse } from '../models';
import { BehaviorSubject, debounceTime, finalize, map, Observable, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GithubSearchService {

	private readonly _searchTrigger$$ = new BehaviorSubject<RepoSearchParams | null>(null);
	private readonly _loading$$ = new BehaviorSubject<boolean>(false);

	constructor(
		private readonly _http: HttpClient
	) { }

	/** Метод для запуска поиска */
	triggerSearch(params: RepoSearchParams): void {
		this._searchTrigger$$.next({
			query: params.query,
			sort: params.sort ?? 'stars',
			order: params.order ?? 'desc'
		});
	}

	getRepos(): Observable<RepoSearchItem[]> {
		return this._searchTrigger$$.pipe(
			switchMap(params => {
				if (!params || !params.query) {
					// сразу отдаём пустой массив
					return of<RepoSearchItem[]>([]);
				}

				this._loading$$.next(true);

				// реальные поисковые запросы — применяем debounce
				return this._searchTrigger$$.pipe(
					debounceTime(2500),
					switchMap((p) => {
						p = p as RepoSearchParams;
						const httpParams = new HttpParams()
							.set('q', `${p.query} in:name`)
							.set('sort', p.sort ?? 'stars')
							.set('order', p.order ?? 'desc');

						return this._http
							.get<RepoSearchResponse>('https://api.github.com/search/repositories', { params: httpParams })
							.pipe(
								map(res => res.items),
								finalize(() => this._loading$$.next(false))
							);
					})
				);
			})
		);
	}

	getLoadingStatus(): Observable<boolean> {
    return this._loading$$.asObservable();
  }
}
