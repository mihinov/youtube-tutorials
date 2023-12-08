import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotesItem, AddedNotesItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

	private readonly stateNotes = new BehaviorSubject(new Map<string, NotesItem>());
	public readonly notes$: Observable<NotesItem[]> = this.stateNotes.pipe(
		map(mapObj => ([...mapObj.values()]))
	);

  constructor() {

		this.add({
			title: 'Заметка 1',
			description: `
				текст текст текст
			`
		});

		this.add({
			title: 'Заметка 2',
			description: `
				текст текст текст
			`
		});

		this.add({
			title: 'Заметка 3',
			description: `
				текст текст текст
			`
		});

		this.add({
			title: 'Заметка 4',
			description: `
				текст текст текст
			`
		});

	}

	public add(addedNotesItem: AddedNotesItem): void {
		const newNotesItem: NotesItem = {
			id: window.crypto.randomUUID(),
			description: addedNotesItem.description,
			title: addedNotesItem.title
		};
		const lastStateNotes = this.stateNotes.value;

		lastStateNotes.set(newNotesItem.id, newNotesItem);
		this.stateNotes.next(lastStateNotes);
	}

	public delete(id: string): void {
		const lastStateNotes = this.stateNotes.value;
		const isNoteExists = lastStateNotes.has(id);

		if (isNoteExists === false) return;
		lastStateNotes.delete(id);
		this.stateNotes.next(lastStateNotes);
	}

	public get(id: string): NotesItem | null {


		const stateNotes = this.stateNotes.value;
		const notesItem = stateNotes.get(id);

		if (notesItem === undefined) return null;

		return notesItem;
	}
}
