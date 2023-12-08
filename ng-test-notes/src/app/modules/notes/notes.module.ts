import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteAtomComponent } from './components/note-atom/note-atom.component';
import { NoteEmptyComponent } from './components/note-empty/note-empty.component';
import { NoteWrapperComponent } from './components/note-wrapper/note-wrapper.component';
import { NoteComponent } from './components/note/note.component';
import { NotesNavComponent } from './components/notes-nav/notes-nav.component';
import { PageNotesComponent } from './pages/page-notes/page-notes.component';
import { NotesRoutingModule } from './notes-routing.module';



@NgModule({
  declarations: [
		PageNotesComponent,
		NotesNavComponent,
		NoteComponent,
		NoteWrapperComponent,
		NoteEmptyComponent,
		NoteAtomComponent
	],
  imports: [
    CommonModule,
		NotesRoutingModule
  ]
})
export class NotesModule { }
