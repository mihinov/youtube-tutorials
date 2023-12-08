import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageErrorComponent } from './pages/page-error/page-error.component';
import { NotesModule } from './modules/notes/notes.module';

const routes: Routes = [
	{ path: '', loadChildren: () => NotesModule },
	{ path: 'error', component: PageErrorComponent },
	{ path: '**', pathMatch: 'full', redirectTo: 'error' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
