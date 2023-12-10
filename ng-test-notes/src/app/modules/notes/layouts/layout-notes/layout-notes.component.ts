import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ModalService } from '../../../modal/modal.service';
import { NotesNavComponent } from '../../components/notes-nav/notes-nav.component';
import { ModalCreateNoteComponent } from '../../components/modal-create-note/modal-create-note.component';

@Component({
  selector: 'app-layout-notes',
  templateUrl: './layout-notes.component.html',
  styleUrl: './layout-notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutNotesComponent implements OnInit {

	constructor(
		private readonly modalService: ModalService,
	) {}

	ngOnInit(): void {
	}

	public clickHeaderBtn(): void {
		const modalRef = this.modalService.open(ModalCreateNoteComponent, {
			data: {
				key: 'dsadasdsada'
			}
		});
	}
}
