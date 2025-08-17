import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		loadComponent: () => import('./pages/page-main/page-main.component'),
		path: ''
	},
	{
		path: '**',
		redirectTo: '',
		pathMatch: 'full'
	}

];
