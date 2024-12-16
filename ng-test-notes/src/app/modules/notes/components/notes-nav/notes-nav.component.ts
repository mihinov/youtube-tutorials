import { Component } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { Observable } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';
import { NotesItem } from '../../models';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'notes-nav',
    templateUrl: './notes-nav.component.html',
    styleUrl: './notes-nav.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLinkActive, RouterLink, AsyncPipe]
})
export class NotesNavComponent {
	public notes$: Observable<NotesItem[]> = this._notesService.notes$;

	constructor(
		private readonly _notesService: NotesService
	) {
	}
}
