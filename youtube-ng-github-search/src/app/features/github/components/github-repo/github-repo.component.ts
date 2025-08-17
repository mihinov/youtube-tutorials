import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RepoSearchItem } from '../../models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-github-repo',
  imports: [
		DatePipe
	],
  templateUrl: './github-repo.component.html',
  styleUrl: './github-repo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubRepoComponent {
	@Input({ required: true }) repo!: RepoSearchItem;
}
