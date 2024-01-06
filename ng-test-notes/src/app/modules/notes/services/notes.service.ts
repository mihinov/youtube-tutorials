import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { NotesItem, AddedNotesItem, NotesItemDeleteInfo } from '../models';
import { LocalStorageService } from '../../../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
	private readonly _keyNotesInLocalStorage: string = 'notes';
	private readonly _stateNotes: BehaviorSubject<NotesItem[]> = new BehaviorSubject([] as NotesItem[]);
	public readonly notes$: Observable<NotesItem[]> = this._stateNotes.pipe(
		shareReplay(1)
	);

  constructor(
		private readonly _localStorageService: LocalStorageService
	) {
		this._initDefaultNotes();
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

	public delete(id: string): NotesItemDeleteInfo {
		const notes = this._stateNotes.value;
		const idxFindedNotesItem = notes.findIndex(notesItem => notesItem.id === id);
		const isNoteExists = idxFindedNotesItem !== -1;

		if (isNoteExists === false) return {
			isEmptyNotes: notes.length === 0,
			nextActiveId: null
		};

		notes.splice(idxFindedNotesItem, 1);
		this._update(notes, true);

		if (notes.length === 0) {
			return {
				isEmptyNotes: notes.length === 0,
				nextActiveId: null
			}
		}

		const nextActiveId = notes[idxFindedNotesItem] === undefined ? notes[notes.length - 1].id : notes[idxFindedNotesItem].id;

		return {
			isEmptyNotes: notes.length === 0,
			nextActiveId: nextActiveId
		}
	}

	public getNotesItem(id: string): NotesItem | null {
		const notes = this._stateNotes.value;
		const findedNotesItem = notes.find(notesItem => notesItem.id === id);

		if (findedNotesItem === undefined) return null;

		return findedNotesItem;
	}

	private _update(newStateNotes: NotesItem[], updateLocalStorage: boolean): void {
		if (updateLocalStorage === true) this._localStorageService.set(this._keyNotesInLocalStorage, newStateNotes);
		this._stateNotes.next(newStateNotes);
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
