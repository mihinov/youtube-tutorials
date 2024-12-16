import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NoteAtomComponent } from '../note-atom/note-atom.component';

@Component({
    selector: 'note-empty',
    templateUrl: './note-empty.component.html',
    styleUrl: './note-empty.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NoteAtomComponent]
})
export class NoteEmptyComponent {

}
