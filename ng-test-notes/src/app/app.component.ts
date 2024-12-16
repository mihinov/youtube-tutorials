import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet],
		changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'ng-test-notes';
}
