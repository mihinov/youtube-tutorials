import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { NotesItem } from '../../models';
import { filter, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent implements OnInit {

	private id$: Observable<string | undefined> = this.route.params.pipe(
		map(params => params['id']),
	);
	public notesItem$: Observable<NotesItem | null> = this.id$.pipe(
		map(id => this.notesService.get(id || '')),
		tap(notesItem => {
			if (notesItem === null) this.router.navigate(['notes']);
		})
	);

	constructor(
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly notesService: NotesService
	) { }

	ngOnInit(): void {

	}

}
