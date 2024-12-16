import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalService } from '../../../modal/modal.service';
import { ModalCreateNoteComponent } from '../../components/modal-create-note/modal-create-note.component';
import { HeaderComponent } from '../../../header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout-notes',
    templateUrl: './layout-notes.component.html',
    styleUrl: './layout-notes.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, RouterOutlet]
})
export class LayoutNotesComponent {
	constructor(
		private readonly _modalService: ModalService
	) {

	}

	public clickHeaderBtn(): void {
		const modalRef = this._modalService.open(ModalCreateNoteComponent);
	}
}
