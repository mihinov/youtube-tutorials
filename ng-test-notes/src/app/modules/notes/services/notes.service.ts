import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { NotesItem, AddedNotesItem } from '../models';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
	private readonly keyNotesInLocalStorage: string = 'notes';
	private readonly keyActiveNotesItemIdInLocalStorage: string = 'activeNotesItemId';
	private readonly stateNotes: BehaviorSubject<Record<string, NotesItem>> = new BehaviorSubject({});
	private readonly stateActiveNotesItemId: BehaviorSubject<string | null> = new BehaviorSubject<null | string>(null);
	public readonly notes$: Observable<NotesItem[]> = this.stateNotes.pipe(
		map(obj => (Object.values(obj))),
		shareReplay(1)
	);
	public readonly activeNotesItemId$: Observable<string | null> = this.stateActiveNotesItemId.pipe(
		shareReplay(1)
	)
	public readonly activeNotesItem$: Observable<NotesItem | null> = this.stateActiveNotesItemId.pipe(
		map(activeNotesItemId => {
			if (activeNotesItemId === null) return null;
			return this._getSyncNotesItem(activeNotesItemId);
		}),
		shareReplay(1)
	);

  constructor(
		private readonly localStorageService: LocalStorageService,
		private readonly router: Router
	) {
		this._initDefaultNotes();
		this._initActiveNoteId();
		this._initActiveNotesItemRouting();
	}

	public add(addedNotesItem: AddedNotesItem): NotesItem {
		const newNotesItem: NotesItem = {
			id: window.crypto.randomUUID(),
			description: addedNotesItem.description,
			title: addedNotesItem.title
		};
		const lastStateNotes = this.stateNotes.value;

		lastStateNotes[newNotesItem.id] = newNotesItem;
		this._update(lastStateNotes, true);

		return newNotesItem;
	}

	public delete(id: string): void {
		const lastStateNotes = this.stateNotes.value;
		const isNoteExists = id in lastStateNotes;

		if (isNoteExists === false) return;

		delete lastStateNotes[id];

		const allIdNotes = Object.keys(lastStateNotes);
		const lastId: string | undefined = allIdNotes[allIdNotes.length - 1];

		if (lastId === undefined) {
			this.localStorageService.delete(this.keyActiveNotesItemIdInLocalStorage);
			this.setActiveNotesItemId(null, false);
		}

		if (lastId !== undefined) {
			this.setActiveNotesItemId(lastId, true);
		}

		this._update(lastStateNotes, true);
	}

	public deleteAll(): void {
		this._update({}, true);
	}

	public getNotesItem(id: string): Observable<NotesItem | null> {
		return this.stateNotes.pipe(
			map(() => this._getSyncNotesItem(id))
		)
	}

	public setActiveNotesItemId(id: string | null, updateLocalStorage: boolean): void {
		if (this.stateActiveNotesItemId.value === id) return;
		this.stateActiveNotesItemId.next(id);
		if (updateLocalStorage === true) this.localStorageService.set(this.keyActiveNotesItemIdInLocalStorage, id);
	}

	public getActiveNotesItemId(): string | null {
		return this.stateActiveNotesItemId.value;
	}

	private _initActiveNotesItemRouting() {
		this.stateActiveNotesItemId.pipe(
			tap((activeNotesItemId) => {
				if (activeNotesItemId === null) {
					this.router.navigate(['notes']);
					return;
				}

				const currentUrl = this.router.url;
				const nextUrl = `/notes/${activeNotesItemId}`;

				if (nextUrl !== currentUrl) {
					this.router.navigateByUrl(nextUrl);
				}
			})
		)
		.subscribe();
	}

	private _update(newStateNotes: Record<string, NotesItem>, updateLocalStorage: boolean): void {
		if (updateLocalStorage === true) this.localStorageService.set(this.keyNotesInLocalStorage, newStateNotes);
		this.stateNotes.next(newStateNotes);
	}

	private _getSyncNotesItem(id: string): NotesItem | null {
		const stateNotes = this.stateNotes.value;
		const isNoteExists = id in stateNotes;

		if (isNoteExists === false) return null;

		return stateNotes[id];
	}

	private _initDefaultNotes(): void {
		const notesInLocalStorage = this.localStorageService.get<Record<string, NotesItem>>(this.keyNotesInLocalStorage);

		if (notesInLocalStorage === null) {
			this._addArrNotes(this._getFourNotes(), true);
			return;
		}

		if (this._isObject(notesInLocalStorage)) {
			this._addObjNotes(notesInLocalStorage, false);
		}
	}

	private _initActiveNoteId(): void {
		const activeNoteIdInLocalStorage = this.localStorageService.get<string>(this.keyActiveNotesItemIdInLocalStorage);

		if (
			activeNoteIdInLocalStorage !== null &&
			typeof activeNoteIdInLocalStorage === 'string'
		) {
			this.stateActiveNotesItemId.next(activeNoteIdInLocalStorage);
		}
	}

	private _addArrNotes(addedNotesItemArr: AddedNotesItem[], updateLocalStorage: boolean): void {
		const stateNotes = this.stateNotes.value;

		for (const addedNotesItem of addedNotesItemArr) {
			const id = window.crypto.randomUUID();
			stateNotes[id] = {
				id: id,
				...addedNotesItem
			};
		}

		this._update(stateNotes, updateLocalStorage);
	}

	private _addObjNotes(objNotes: Record<string, NotesItem>, updateLocalStorage: boolean) {
		this._update(objNotes, updateLocalStorage);
	}

	private _getFourNotes(): AddedNotesItem[] {
		return [
			{
				title: 'Заметка 1',
				description: `
					текст текст текст
				`
			},
			{
				title: 'Заметка 2',
				description: `
					текст текст текст
				`
			},
			{
				title: 'Заметка 3',
				description: `
					текст текст текст
				`
			},
			{
				title: 'Заметка 4',
				description: `
					текст текст текст
				`
			}
		];
	}

	private _isObject(obj: any): boolean {
		return Object.prototype.toString.call(obj) === '[object Object]';
	}
}
