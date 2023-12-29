import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import { AddedNotesItem } from '../../models';
import { MODAL_DATA, MODAL_REF } from '../../../modal/modal.tokens';
import { ModalRef } from '../../../modal/modal.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-create-note',
  templateUrl: './modal-create-note.component.html',
  styleUrl: './modal-create-note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalCreateNoteComponent {

	public form = new FormGroup({
		title: new FormControl('', [Validators.required]),
		description: new FormControl('', [Validators.required])
	});

	constructor(
		private readonly _notesService: NotesService,
		@Inject(MODAL_REF) private readonly _modalRef: ModalRef,
		@Inject(MODAL_DATA) private readonly _modalData: any,
		private readonly _router: Router
	) {
	}

	public submitForm(): void {
		if (this.form.valid === false) return;

		const formValue = this.form.value as AddedNotesItem;
		const notesItem = this._notesService.add(formValue);

		this._modalRef.destroy(notesItem);
		this._router.navigate(['notes', notesItem.id]);
	}

}
