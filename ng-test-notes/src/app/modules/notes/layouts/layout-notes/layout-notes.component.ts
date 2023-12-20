import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ModalService } from '../../../modal/modal.service';
import { ModalCreateNoteComponent } from '../../components/modal-create-note/modal-create-note.component';
import { NoteEmptyComponent } from '../../components/note-empty/note-empty.component';

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
		this.modalService.open(ModalCreateNoteComponent);
		console.log(1);

	}
}
