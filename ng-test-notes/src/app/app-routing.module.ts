import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutMainComponent } from './layouts/layout-main/layout-main.component';
import { PageNotesComponent } from './pages/page-notes/page-notes.component';
import { PageErrorComponent } from './pages/page-error/page-error.component';
import { NoteComponent } from './components/note/note.component';
import { NoteWrapperComponent } from './components/note-wrapper/note-wrapper.component';
import { NoteEmptyComponent } from './components/note-empty/note-empty.component';

const routes: Routes = [
	{ path: '', component: LayoutMainComponent, children: [
		{ path: '', redirectTo: 'notes', pathMatch: 'full' },
		{ path: 'notes', component: PageNotesComponent, children: [
			{ path: '', component: NoteWrapperComponent, children: [
				{ path: '', component: NoteEmptyComponent },
				{ path: ':id', component: NoteComponent }
			] },
		] },
		{ path: 'error', component: PageErrorComponent },
		{ path: '**', redirectTo: 'error' },
	] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
