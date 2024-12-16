import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotesItem } from '../../models';
import { LineBreaksToBrPipe } from '../../../../pipes/line-breaks-to-br.pipe';

@Component({
    selector: 'note-atom',
    templateUrl: './note-atom.component.html',
    styleUrl: './note-atom.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LineBreaksToBrPipe]
})
export class NoteAtomComponent {
	@Input({ required: true }) public notesItem!: NotesItem;
}
