import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RepoSearchItem, RepoSearchParams, RepoSearchResponse } from '../models';
import { BehaviorSubject, catchError, debounceTime, filter, finalize, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GithubSearchService {

	private readonly _searchTrigger$$ = new BehaviorSubject<RepoSearchParams | null>(null);
	private readonly _loading$$ = new BehaviorSubject<boolean>(false);
	private _cache: Map<string, RepoSearchItem[]> = new Map();

	constructor(
		private readonly _http: HttpClient
	) { }

	triggerSearch(params: RepoSearchParams): void {
		const normalizedQuery = params.query
			?.trim()                       // обрезаем пробелы по бокам
			.replace(/\s+/g, ' ')          // схлопываем все подряд идущие пробелы
			.toLowerCase() ?? '';          // приводим к нижнему регистру

		this._searchTrigger$$.next({
			query: normalizedQuery,
			sort: params.sort ?? 'stars',
			order: params.order,
			searchBy: {
				name: params.searchBy.name,
				description: params.searchBy.description
			}
		});
	}

	getRepos(): Observable<RepoSearchItem[]> {
		return this._searchTrigger$$.pipe(
			switchMap(params => {
				if (params === null || params.query === '') {
					this._loading$$.next(false);
					return of([] as RepoSearchItem[]);
				}
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
					switchMap(p => {
						return this._getRepos(p).pipe(
							tap(repos => {
								this._cache.set(key, repos);
							}),
							catchError((error) => {
								alert(error.message);
								return of([] as RepoSearchItem[]);
							}),
							finalize(() => this._loading$$.next(false))
						);
					})
				);
			})
		);
	}

	private _getRepos(params: RepoSearchParams): Observable<RepoSearchItem[]> {
		const searchBy = params.searchBy;

		// Если оба поля false
		const useNameAndDescriptionByDefault = searchBy.name === false && searchBy.description === false;

		const fields: string[] = [];

		if (useNameAndDescriptionByDefault) {
			fields.push('name');
		} else {
			if (searchBy.name) fields.push('name');
			if (searchBy.description) fields.push('description');
		}

		const inFields = fields.length > 0 ? ` in:${fields.join(',')}` : '';
		let httpParams = new HttpParams().set('q', `${params.query}${inFields}`);

		if (params.sort) {
			httpParams = httpParams.set('sort', params.sort);
		}

		if (params.order) {
			httpParams = httpParams.set('order', params.order);
		}

		return this._http.get<RepoSearchResponse>(
			'https://api.github.com/search/repositories',
			{ params: httpParams }
		).pipe(
			map(res => res.items)
		);
	}

	getLoadingStatus(): Observable<boolean> {
		return this._loading$$.asObservable();
	}
}
