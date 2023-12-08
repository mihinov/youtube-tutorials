import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotesItem } from '../../../../models';

@Component({
  selector: 'note-atom',
  templateUrl: './note-atom.component.html',
  styleUrl: './note-atom.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteAtomComponent {
	@Input({ required: true }) notesItem!: NotesItem;
}
