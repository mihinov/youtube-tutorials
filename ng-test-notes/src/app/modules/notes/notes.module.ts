import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteAtomComponent } from './components/note-atom/note-atom.component';
import { NoteEmptyComponent } from './components/note-empty/note-empty.component';
import { NoteComponent } from './components/note/note.component';
import { NotesNavComponent } from './components/notes-nav/notes-nav.component';
import { PageNotesComponent } from './pages/page-notes/page-notes.component';
import { NotesRoutingModule } from './notes-routing.module';
import { LayoutNotesComponent } from './layouts/layout-notes/layout-notes.component';
import { HeaderModule } from '../header/header.module';
import { ModalService } from '../modal/modal.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalCreateNoteComponent } from './components/modal-create-note/modal-create-note.component';
import { LineBreaksToBrPipe } from '../../pipes/line-breaks-to-br.pipe';

@NgModule({
  declarations: [
		PageNotesComponent,
		NotesNavComponent,
		NoteComponent,
		NoteEmptyComponent,
		NoteAtomComponent,
  	LayoutNotesComponent,
		ModalCreateNoteComponent,
		LineBreaksToBrPipe,
	],
  imports: [
    CommonModule,
		NotesRoutingModule,
		HeaderModule,
		ReactiveFormsModule
  ],
	providers: [
		ModalService
	]
})
export class NotesModule { }
