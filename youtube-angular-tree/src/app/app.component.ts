import { Component } from '@angular/core';
import { AngularTreeComponent } from './angular-tree/angular-tree.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	imports: [AngularTreeComponent]
})
export class AppComponent {
	title = 'youtube-angular-tree';
}

