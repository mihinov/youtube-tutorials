import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'notes-router-entry',
  templateUrl: './notes-router-entry.component.html',
  styleUrl: './notes-router-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterOutlet]
})
export class NotesRouterEntryComponent {

}


