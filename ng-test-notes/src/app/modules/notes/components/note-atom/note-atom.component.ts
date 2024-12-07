import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotesItem } from '../../models';

@Component({
    selector: 'note-atom',
    templateUrl: './note-atom.component.html',
    styleUrl: './note-atom.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NoteAtomComponent {
	@Input({ required: true }) public notesItem!: NotesItem;
}
