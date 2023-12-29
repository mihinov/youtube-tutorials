import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalService } from '../../../modal/modal.service';
import { ModalCreateNoteComponent } from '../../components/modal-create-note/modal-create-note.component';

@Component({
  selector: 'app-layout-notes',
  templateUrl: './layout-notes.component.html',
  styleUrl: './layout-notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutNotesComponent {
	constructor(
		private readonly _modalService: ModalService
	) {

	}

	public clickHeaderBtn(): void {
		const modalRef = this._modalService.open(ModalCreateNoteComponent);

		// modalRef.afterOpened().subscribe(() => console.log('afterOpened'));
		// modalRef.afterClosed().subscribe((result) => {
		// 	console.log('afterClosed');
		// 	console.log(result);
		// });

	}
}
