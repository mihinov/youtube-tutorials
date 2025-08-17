import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GithubSearchService } from '../../services/github-search.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { GithubRepoComponent } from '../github-repo/github-repo.component';
import { SpinnerComponent } from '../../../../shared/component-spinner/spinner.component';
import { LoadingDirective } from '../../../../shared/directives/loading.directive';

@Component({
  selector: 'app-github-repos',
  imports: [
    AsyncPipe,
    GithubRepoComponent,
    SpinnerComponent,
    LoadingDirective,
		NgIf
],
  templateUrl: './github-repos.component.html',
  styleUrl: './github-repos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubReposComponent {
	private readonly _githubSearchService = inject(GithubSearchService);
	protected readonly repos$ = this._githubSearchService.getRepos();
	protected readonly reposLoading$ = this._githubSearchService.getLoadingStatus();
}
