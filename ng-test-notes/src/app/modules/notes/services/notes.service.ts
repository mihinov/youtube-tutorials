import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotesItem, AddedNotesItem } from '../models';
import { LocalStorageService } from '../../../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
	private readonly keyInLocalStorage: string = 'notes';
	private readonly stateNotes: BehaviorSubject<Record<string, NotesItem>> = new BehaviorSubject({});
	public readonly notes$: Observable<NotesItem[]> = this.stateNotes.pipe(
		map(obj => (Object.values(obj)))
	);

  constructor(
		private readonly localStorageService: LocalStorageService
	) {
		this.initDefaultNotes();
	}

	public add(addedNotesItem: AddedNotesItem): void {
		const newNotesItem: NotesItem = {
			id: window.crypto.randomUUID(),
			description: addedNotesItem.description,
			title: addedNotesItem.title
		};
		const lastStateNotes = this.stateNotes.value;

		lastStateNotes[newNotesItem.id] = newNotesItem;

		this.localStorageService.set(this.keyInLocalStorage, lastStateNotes);
		this.stateNotes.next(lastStateNotes);
	}

	public delete(id: string): void {
		const lastStateNotes = this.stateNotes.value;
		const isNoteExists = id in lastStateNotes;

		if (isNoteExists === false) return;
		delete lastStateNotes[id];
		this.localStorageService.set(this.keyInLocalStorage, lastStateNotes);
		this.stateNotes.next(lastStateNotes);
	}

	private _getSync(id: string): NotesItem | null {
		const stateNotes = this.stateNotes.value;
		const isNoteExists = id in stateNotes;

		if (isNoteExists === false) return null;

		return stateNotes[id];
	}

	public get(id: string): Observable<NotesItem | null> {
		return this.stateNotes.pipe(
			map(() => this._getSync(id))
		)
	}

	private initDefaultNotes(): void {
		const notesInLocalStorage = this.localStorageService.get(this.keyInLocalStorage);

		if (notesInLocalStorage === null) {
			this.addArrNotes(this.getFourNotes());
			return;
		}

		if (this.isObject(notesInLocalStorage)) {
			this.addObjNotes(notesInLocalStorage);
		}
	}

	private addArrNotes(addedNotesItemArr: AddedNotesItem[]): void {
		const stateNotes = this.stateNotes.value;

		for (const addedNotesItem of addedNotesItemArr) {
			const id = window.crypto.randomUUID();
			stateNotes[id] = {
				id: id,
				...addedNotesItem
			};
		}

		this.localStorageService.set(this.keyInLocalStorage, stateNotes);
		this.stateNotes.next(stateNotes);
	}

	private addObjNotes(objNotes: Record<string, NotesItem>) {
		this.stateNotes.next(objNotes);
	}

	private getFourNotes(): AddedNotesItem[] {
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

	private isObject(obj: any): boolean {
		return Object.prototype.toString.call(obj) === '[object Object]';
	}
}
