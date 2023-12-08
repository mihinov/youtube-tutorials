import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'note-wrapper',
  templateUrl: './note-wrapper.component.html',
  styleUrl: './note-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteWrapperComponent {

}
