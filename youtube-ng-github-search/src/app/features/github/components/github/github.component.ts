import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GithubReposComponent } from '../github-repos/github-repos.component';
import { GithubSearchComponent } from '../github-search/github-search.component';

@Component({
  selector: 'app-github',
  imports: [
		GithubReposComponent,
		GithubSearchComponent
	],
  templateUrl: './github.component.html',
  styleUrl: './github.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubComponent {

}
