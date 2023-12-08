import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { NoteAtomComponent } from '../../components/note-atom/note-atom.component';
import { ModalService } from '../../../modal/modal.service';
import { NotesNavComponent } from '../../components/notes-nav/notes-nav.component';

@Component({
  selector: 'app-layout-notes',
  templateUrl: './layout-notes.component.html',
  styleUrl: './layout-notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutNotesComponent implements OnInit {

	constructor(
		private readonly modalService: ModalService
	) {}

	ngOnInit(): void {
	}

	public clickHeaderBtn(): void {
		this.modalService.open(NotesNavComponent);
	}
}
