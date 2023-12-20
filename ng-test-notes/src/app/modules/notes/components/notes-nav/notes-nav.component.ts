import { ChangeDetectorRef, Component } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { Observable, filter, map, tap } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';
import { NotesItem } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'notes-nav',
  templateUrl: './notes-nav.component.html',
  styleUrl: './notes-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesNavComponent {
	public notes$: Observable<NotesItem[]> = this.notesService.notes$;
	public activeNotesItemId$: Observable<string | null> = this.notesService.activeNotesItemId$;

	constructor(
		private readonly notesService: NotesService
	) {
	}
}
