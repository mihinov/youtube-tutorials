import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NoteWrapperComponent } from "./components/note-wrapper/note-wrapper.component";
import { NoteEmptyComponent } from "./components/note-empty/note-empty.component";
import { NoteComponent } from "./components/note/note.component";
import { PageNotesComponent } from "./pages/page-notes/page-notes.component";

const routes: Routes = [
	{ path: '', component: PageNotesComponent, children: [
		{ path: '', component: NoteWrapperComponent, children: [
			{ path: '', component: NoteEmptyComponent },
			{ path: ':id', component: NoteComponent }
		] },
	] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule { }
