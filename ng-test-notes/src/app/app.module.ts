import { TuiRootModule } from "@taiga-ui/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageErrorComponent } from './pages/page-error/page-error.component';
import { LayoutMainComponent } from './layouts/layout-main/layout-main.component';
import { PageNotesComponent } from './pages/page-notes/page-notes.component';
import { HeaderComponent } from './components/header/header.component';
import { NotesNavComponent } from './components/notes-nav/notes-nav.component';
import { NoteComponent } from './components/note/note.component';
import { NoteWrapperComponent } from './components/note-wrapper/note-wrapper.component';
import { NoteEmptyComponent } from './components/note-empty/note-empty.component';
import { NoteAtomComponent } from './components/note-atom/note-atom.component';

@NgModule({
	declarations: [
		AppComponent,
		PageErrorComponent,
		LayoutMainComponent,
		PageNotesComponent,
		HeaderComponent,
		NotesNavComponent,
		NoteComponent,
		NoteWrapperComponent,
		NoteEmptyComponent,
		NoteAtomComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
        BrowserAnimationsModule,
        TuiRootModule
    ],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
