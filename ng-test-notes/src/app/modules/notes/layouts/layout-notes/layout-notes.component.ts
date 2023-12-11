import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ModalService } from '../../../modal/modal.service';
import { ModalCreateNoteComponent } from '../../components/modal-create-note/modal-create-note.component';
import { MODAL_DATA, MODAL_REF } from '../../../modal/modal.tokens';

@Component({
  selector: 'app-layout-notes',
  templateUrl: './layout-notes.component.html',
  styleUrl: './layout-notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutNotesComponent {
	constructor(
		private readonly modalService: ModalService
	) {

	}

	public clickHeaderBtn(): void {


		const modalRef = this.modalService.open(ModalCreateNoteComponent, {
			data: {
				key: 'dsadasdsada'
			}
		});

		// (window as any).modalRef = modalRef;

		// modalRef.afterClosed().subscribe(() => console.log('afterClosed'));
		// modalRef.afterOpened().subscribe(() => console.log('afterOpened'));
	}
}
