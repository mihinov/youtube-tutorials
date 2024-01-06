import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';
import { NotesItem } from '../../models';


@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent {
	private _notesItem: BehaviorSubject<NotesItem | null> = new BehaviorSubject<NotesItem | null>(null);
	private _id$: Observable<string | undefined> = this._route.params.pipe(
		map(params => params['id'])
	);
	public notesItem$: Observable<NotesItem | null> = this._id$.pipe(
		map(id => {
			if (id === undefined) return null;
			return this._notesService.getNotesItem(id);
		}),
		tap(notesItem => {
			if (notesItem === null) {
				this._router.navigateByUrl('notes');
				return;
			}
			this._notesItem.next(notesItem);
		})
	);

	constructor(
		private readonly _route: ActivatedRoute,
		private readonly _router: Router,
		private readonly _notesService: NotesService
	) { }

	public clickDeleteBtn(): void {
		if (this._notesItem.value === null) return;

		const deleteInfo = this._notesService.delete(this._notesItem.value.id);

		if (deleteInfo.isEmptyNotes === true) {
			this._router.navigateByUrl('notes');
		} else if (deleteInfo.nextActiveId !== null) {
			this._router.navigate(['notes', deleteInfo.nextActiveId]);
		}
	}

}
