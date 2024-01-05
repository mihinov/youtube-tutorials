import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageErrorComponent } from './pages/page-error/page-error.component';
import { NotesModule } from './modules/notes/notes.module';

export const routes: Routes = [
	{ path: '', redirectTo: 'notes', pathMatch: 'full' },
	{ path: 'notes', loadChildren: () => NotesModule },
	{ path: 'error', component: PageErrorComponent },
	{ path: '**', redirectTo: 'error', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
