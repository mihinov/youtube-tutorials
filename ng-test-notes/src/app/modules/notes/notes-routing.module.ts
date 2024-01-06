import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NoteEmptyComponent } from "./components/note-empty/note-empty.component";
import { NoteComponent } from "./components/note/note.component";
import { PageNotesComponent } from "./pages/page-notes/page-notes.component";
import { LayoutNotesComponent } from "./layouts/layout-notes/layout-notes.component";

const routes: Routes = [
	{ path: '', component: LayoutNotesComponent, children: [
		{ path: '', component: PageNotesComponent, children: [
			{ path: '', component: NoteEmptyComponent },
			{ path: ':id', component: NoteComponent }
		] },
	]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule { }
