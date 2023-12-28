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
	private readonly _keyNotesInLocalStorage: string = 'notes';
	private readonly _keyActiveNotesItemIdInLocalStorage: string = 'activeNotesItemId';
	private readonly _stateNotes: BehaviorSubject<NotesItem[]> = new BehaviorSubject([] as NotesItem[]);
	private readonly _stateActiveNotesItemId: BehaviorSubject<string | null> = new BehaviorSubject<null | string>(null);
	public readonly notes$: Observable<NotesItem[]> = this._stateNotes.pipe(
		shareReplay(1)
	);
	public readonly activeNotesItemId$: Observable<string | null> = this._stateActiveNotesItemId.pipe(
		shareReplay(1)
	)
	public readonly activeNotesItem$: Observable<NotesItem | null> = this._stateActiveNotesItemId.pipe(
		map(activeNotesItemId => {
			if (activeNotesItemId === null) return null;
			return this._getSyncNotesItem(activeNotesItemId);
		}),
		shareReplay(1)
	);

  constructor(
		private readonly _localStorageService: LocalStorageService,
		private readonly _router: Router
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
		const notes = this._stateNotes.value;

		notes.push(newNotesItem);
		this._update(notes, true);

		return newNotesItem;
	}

	public delete(id: string): void {
		const notes = this._stateNotes.value;
		const idxFindedNotesItem = notes.findIndex(notesItem => notesItem.id === id);
		const isNoteExists = idxFindedNotesItem !== -1;

		if (isNoteExists === false) return;

		notes.splice(idxFindedNotesItem, 1);

		if (notes.length === 0) {
			this._localStorageService.delete(this._keyActiveNotesItemIdInLocalStorage);
			this.setActiveNotesItemId(null, false);
			this._update(notes, true);
			return;
		}

		const nextActiveId = notes[idxFindedNotesItem] === undefined ? notes[notes.length - 1].id : notes[idxFindedNotesItem].id;

		this.setActiveNotesItemId(nextActiveId, true);
		this._update(notes, true);
	}

	public getNotesItem(id: string): Observable<NotesItem | null> {
		return this._stateNotes.pipe(
			map(() => this._getSyncNotesItem(id))
		)
	}

	public setActiveNotesItemId(id: string | null, updateLocalStorage: boolean): void {
		if (this._stateActiveNotesItemId.value === id) return;
		this._stateActiveNotesItemId.next(id);
		if (updateLocalStorage === true) this._localStorageService.set(this._keyActiveNotesItemIdInLocalStorage, id);
	}

	public getActiveNotesItemId(): string | null {
		return this._stateActiveNotesItemId.value;
	}

	private _initActiveNotesItemRouting() {
		this.activeNotesItemId$.pipe(
			tap((activeNotesItemId) => {
				if (activeNotesItemId === null) {
					this._router.navigate(['notes']);
					return;
				}

				const currentUrl = this._router.url;
				const nextUrl = `/notes/${activeNotesItemId}`;

				if (nextUrl !== currentUrl) {
					this._router.navigateByUrl(nextUrl);
				}
			})
		)
		.subscribe();
	}

	private _update(newStateNotes: NotesItem[], updateLocalStorage: boolean): void {
		if (updateLocalStorage === true) this._localStorageService.set(this._keyNotesInLocalStorage, newStateNotes);
		this._stateNotes.next(newStateNotes);
	}

	private _getSyncNotesItem(id: string): NotesItem | null {
		const notes = this._stateNotes.value;
		const findedNotesItem = notes.find(notesItem => notesItem.id === id);

		if (findedNotesItem === undefined) return null;

		return findedNotesItem;
	}

	private _initDefaultNotes(): void {
		const notesInLocalStorage = this._localStorageService.get<NotesItem[]>(this._keyNotesInLocalStorage);

		if (notesInLocalStorage === null) {
			this._addArrNotes(this._getFourNotes(), true);
			return;
		}

		if (Array.isArray(notesInLocalStorage)) {
			this._addArrNotes(notesInLocalStorage, false);
		}
	}

	private _initActiveNoteId(): void {
		const activeNoteIdInLocalStorage = this._localStorageService.get<string>(this._keyActiveNotesItemIdInLocalStorage);

		if (
			activeNoteIdInLocalStorage !== null &&
			typeof activeNoteIdInLocalStorage === 'string'
		) {
			this._stateActiveNotesItemId.next(activeNoteIdInLocalStorage);
		}
	}

	private _addArrNotes(notesItemArr: NotesItem[], updateLocalStorage: boolean): void {
		const notes = [...this._stateNotes.value, ...notesItemArr];

		this._update(notes, updateLocalStorage);
	}

	private _getFourNotes(): NotesItem[] {
		return [
			{
				id: window.crypto.randomUUID(),
				title: 'Заметка 1',
				description: `
					текст текст текст
				`
			},
			{
				id: window.crypto.randomUUID(),
				title: 'Заметка 2',
				description: `
					текст текст текст
				`
			},
			{
				id: window.crypto.randomUUID(),
				title: 'Заметка 3',
				description: `
					текст текст текст
				`
			},
			{
				id: window.crypto.randomUUID(),
				title: 'Заметка 4',
				description: `
					текст текст текст
				`
			}
		];
	}
}
