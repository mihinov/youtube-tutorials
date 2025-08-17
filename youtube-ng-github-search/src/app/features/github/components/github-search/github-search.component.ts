import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GithubSearchService } from '../../services/github-search.service';

@Component({
  selector: 'app-github-search',
  imports: [],
  templateUrl: './github-search.component.html',
  styleUrl: './github-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubSearchComponent {
	constructor(
		private readonly _githubSearchService: GithubSearchService
	) {}

	triggerSearch(event: Event) {
		const inputElement: any = event.target;
		const value = inputElement.value;

		this._githubSearchService.triggerSearch({ query: value });
	}
}
