import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GithubComponent } from '../../features/github/components/github/github.component';

@Component({
  selector: 'app-page-main',
  imports: [
		GithubComponent
	],
  templateUrl: './page-main.component.html',
  styleUrl: './page-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PageMainComponent {

}
