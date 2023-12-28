import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';
import { NotesItem } from '../../models';


@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent {

	private _notesItem: NotesItem | null = null;
	private _id$: Observable<string | undefined> = this._route.params.pipe(
		map(params => params['id']),
	);
	public notesItem$: Observable<NotesItem | null> = this._id$.pipe(
		switchMap((id) => {
			if (id === undefined) return of(null);
			return this._notesService.getNotesItem(id).pipe(take(1))
		}),
		tap(notesItem => {
			if (notesItem === null) {
				this._router.navigate(['notes']);
				return;
			}
			this._notesService.setActiveNotesItemId(notesItem.id, true);
			this._notesItem = notesItem;
		})
	);

	constructor(
		private readonly _route: ActivatedRoute,
		private readonly _router: Router,
		private readonly _notesService: NotesService
	) { }

	public clickDeleteBtn(): void {
		if (this._notesItem === null) return;
		this._notesService.delete(this._notesItem.id);
	}

}
