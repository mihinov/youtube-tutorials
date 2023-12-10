import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-modal-create-note',
  templateUrl: './modal-create-note.component.html',
  styleUrl: './modal-create-note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalCreateNoteComponent {

	constructor(
		// @Inject(MODAL_DATA) public data: any,
	) {
		// console.log(data);
	}

}
