import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout-notes',
  templateUrl: './layout-notes.component.html',
  styleUrl: './layout-notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutNotesComponent implements OnInit {
	ngOnInit(): void {
	}

	public clickHeaderBtn(): void {
	}
}
