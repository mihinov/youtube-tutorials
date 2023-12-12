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

	form = new FormGroup({
		title: new FormControl('', [Validators.required]),
		description: new FormControl('', [Validators.required])
	});

	constructor(
		private readonly notesService: NotesService,
		@Inject(MODAL_REF) private readonly modalRef: ModalRef,
		private readonly router: Router
	) {
	}

	public submitForm(): void {
		if (this.form.valid === false) return;

		const formValue = this.form.value as AddedNotesItem;
		const notesItem = this.notesService.add(formValue);

		this.modalRef.destroy();
		this.router.navigate(['notes', notesItem.id]);
	}

}
