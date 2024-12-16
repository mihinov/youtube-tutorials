import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { NotesNavComponent } from '../../components/notes-nav/notes-nav.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-page-notes',
    templateUrl: './page-notes.component.html',
    styleUrl: './page-notes.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NotesNavComponent, RouterOutlet]
})
export class PageNotesComponent {
}
