import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteAtomComponent } from './components/note-atom/note-atom.component';
import { NoteEmptyComponent } from './components/note-empty/note-empty.component';
import { NoteWrapperComponent } from './components/note-wrapper/note-wrapper.component';
import { NoteComponent } from './components/note/note.component';
import { NotesNavComponent } from './components/notes-nav/notes-nav.component';
import { PageNotesComponent } from './pages/page-notes/page-notes.component';
import { NotesRoutingModule } from './notes-routing.module';
import { LayoutNotesComponent } from './layouts/layout-notes/layout-notes.component';
import { HeaderModule } from '../header/header.module';

@NgModule({
  declarations: [
		PageNotesComponent,
		NotesNavComponent,
		NoteComponent,
		NoteWrapperComponent,
		NoteEmptyComponent,
		NoteAtomComponent,
  	LayoutNotesComponent
	],
  imports: [
    CommonModule,
		NotesRoutingModule,
		HeaderModule,
  ]
})
export class NotesModule { }