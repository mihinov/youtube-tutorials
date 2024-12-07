import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'layout-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class HeaderComponent {

}
