import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotesItem } from '../../models';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'note-atom',
  templateUrl: './note-atom.component.html',
  styleUrl: './note-atom.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteAtomComponent {
	@Input({ required: true }) public notesItem!: NotesItem;

	constructor(
		private readonly notesService: NotesService
	) {}
}
