import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'note-empty',
    templateUrl: './note-empty.component.html',
    styleUrl: './note-empty.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NoteEmptyComponent {

}
