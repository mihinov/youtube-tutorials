import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GithubSearchService } from '../../services/github-search.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-github-search',
  imports: [
		ReactiveFormsModule
	],
  templateUrl: './github-search.component.html',
  styleUrl: './github-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubSearchComponent {
	protected readonly form = new FormGroup({
		name: new FormControl(true),
		description: new FormControl(false),
		sortByStars: new FormControl(true),
		query: new FormControl('')
	});

	constructor(
		private readonly _githubSearchService: GithubSearchService
	) {}

	triggerSearch(): void {
		const query = this.form.controls.query.value!;
		const name = this.form.controls.name.value!;
		const description = this.form.controls.description.value!;
		const sortByStars = this.form.controls.sortByStars.value!;

		this._githubSearchService.triggerSearch({
			query: query,
			searchBy: {
				name: name,
				description: description
			},
			order: sortByStars ? 'desc' : 'asc'
		});
	}
}
