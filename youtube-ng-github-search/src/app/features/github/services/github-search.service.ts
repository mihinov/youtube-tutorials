import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RepoSearchItem, RepoSearchParams, RepoSearchResponse } from '../models';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, filter, finalize, map, merge, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GithubSearchService {

	private readonly _searchTrigger$$ = new BehaviorSubject<RepoSearchParams | null>(null);
	private readonly _loading$$ = new BehaviorSubject<boolean>(false);
	private _cache: Map<string, RepoSearchItem[]> = new Map();

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
		const empty$ = this._searchTrigger$$.pipe(
			filter(params => !params || !params.query),
			tap(() => this._loading$$.next(false)),
			map(() => [] as RepoSearchItem[])
		);

		const search$ = this._searchTrigger$$.pipe(
			filter((params): params is RepoSearchParams => !!params && !!params.query),
			switchMap(params => {
				const key = JSON.stringify(params);

				// если есть кэш — отдаем сразу, не трогаем debounce
				if (this._cache.has(key)) {
					this._loading$$.next(false);
					return of(this._cache.get(key)!);
				}

				// иначе делаем HTTP-запрос с дебаунсом
				return this._searchTrigger$$.pipe(
					filter((p): p is RepoSearchParams => !!p && !!p.query),
					tap(() => this._loading$$.next(true)),
					debounceTime(2500),
					distinctUntilChanged((prev, curr) =>
						prev.query === curr.query &&
						prev.sort === curr.sort &&
						prev.order === curr.order
					),
					switchMap(p => {
						const httpParams = new HttpParams()
							.set('q', `${p.query} in:name`)
							.set('sort', p.sort ?? 'stars')
							.set('order', p.order ?? 'desc');

						return this._http.get<RepoSearchResponse>(
							'https://api.github.com/search/repositories',
							{ params: httpParams }
						).pipe(
							map(res => {
								this._cache.set(key, res.items);
								return res.items;
							}),
							catchError(() => of([] as RepoSearchItem[])),
							finalize(() => this._loading$$.next(false))
						);
					})
				);
			})
		);

		return merge(empty$, search$);
	}

	getLoadingStatus(): Observable<boolean> {
		return this._loading$$.asObservable();
	}
}
