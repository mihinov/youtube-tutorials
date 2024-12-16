import { Routes } from "@angular/router";
import { PageErrorComponent } from "./pages/page-error/page-error.component";

export const routes: Routes = [
	{ path: '', redirectTo: 'notes', pathMatch: 'full' },
	{
		path: 'notes',
		loadChildren: () => import('./modules/notes/notes.routes').then(m => m.notesRoutes)
	},
	{ path: 'error', component: PageErrorComponent },
	{ path: '**', redirectTo: 'error', pathMatch: 'full' },
];
