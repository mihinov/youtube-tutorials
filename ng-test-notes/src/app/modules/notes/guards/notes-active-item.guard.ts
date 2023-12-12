import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NotesService } from '../services/notes.service';
import { map } from 'rxjs';

export const notesActiveItemGuard: CanActivateFn = (route, state) => {
	const notesService = inject(NotesService);
	const router = inject(Router);
	const isActiveItem: boolean = route.queryParams['isActiveItem'] === 'true';

  return notesService.activeNotesItemId$.pipe(
		map((activeNotesItemId) => {
			if (activeNotesItemId === null || isActiveItem === true) return true;
			router.navigate(['notes', activeNotesItemId], { queryParams: { isActiveItem: 'true' } });
			return false;
		})
	);
};
