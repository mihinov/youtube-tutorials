import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

}
