import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { filter, map, switchMap, tap } from 'rxjs/operators';
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

	private notesItem: NotesItem | null = null;
	private id$: Observable<string | undefined> = this.route.params.pipe(
		map(params => params['id']),
	);
	public notesItem$: Observable<NotesItem | null> = this.id$.pipe(
		switchMap((id) => {
			if (id === undefined) return of(null);
			return this.notesService.get(id);
		}),
		tap(notesItem => {
			if (notesItem === null) this.router.navigate(['notes']);
			this.notesItem = notesItem;
		})
	);

	constructor(
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly notesService: NotesService
	) { }

	public clickDeleteBtn(): void {
		if (this.notesItem === null) return;
		this.notesService.delete(this.notesItem.id);
	}

}
