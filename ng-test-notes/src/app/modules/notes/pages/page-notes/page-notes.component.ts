import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { Observable, map } from 'rxjs';
import { isEmptyNotes } from '../../models';

@Component({
  selector: 'app-page-notes',
  templateUrl: './page-notes.component.html',
  styleUrl: './page-notes.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotesComponent {
	constructor(
		private readonly notesService: NotesService
	) {}

	public clickDeleteAllBtn(): void {
		this.notesService.deleteAll();
	}
}
