import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrl: './layout-main.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutMainComponent {

}
