import { Routes } from "@angular/router";
import { NoteEmptyComponent } from "./components/note-empty/note-empty.component";
import { NoteComponent } from "./components/note/note.component";
import { LayoutNotesComponent } from "./layouts/layout-notes/layout-notes.component";
import { PageNotesComponent } from "./pages/page-notes/page-notes.component";

export const notesRoutes: Routes = [
	{ path: '', component: LayoutNotesComponent, children: [
		{ path: '', component: PageNotesComponent, children: [
			{ path: '', component: NoteEmptyComponent },
			{ path: ':id', component: NoteComponent }
		] },
	]},
];
