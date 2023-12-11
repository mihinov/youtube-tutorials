import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-create-note',
  templateUrl: './modal-create-note.component.html',
  styleUrl: './modal-create-note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalCreateNoteComponent {

	form = new FormGroup({
		text: new FormControl('hello'),
		text1: new FormControl('hello')
	});

	constructor(
		// @Inject(MODAL_DATA) public data: any,
	) {
		// console.log(data);
	}

}
