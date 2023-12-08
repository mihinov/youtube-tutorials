import { Component } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { Observable } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';
import { NotesItem } from '../../models';

@Component({
  selector: 'notes-nav',
  templateUrl: './notes-nav.component.html',
  styleUrl: './notes-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesNavComponent {
	public notes$: Observable<NotesItem[]> = this.notesService.notes$;

	constructor(
		private readonly notesService: NotesService
	) { }
}
