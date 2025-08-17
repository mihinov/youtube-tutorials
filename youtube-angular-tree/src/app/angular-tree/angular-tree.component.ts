import { ChangeDetectionStrategy, Component, inject, Input, OnInit, Inject, forwardRef, DOCUMENT } from '@angular/core';
import { TreeData, TreeNestedNode, TreeNodeStateEditable } from './angular-tree.types';
import { TreeService } from './services/tree.service';
import { Observable, of } from 'rxjs';
import { NgClass, AsyncPipe } from '@angular/common';
import gsap from 'gsap';


@Component({
	selector: 'app-angular-tree',
	templateUrl: './angular-tree.component.html',
	styleUrls: ['./angular-tree.component.scss'],
	providers: [
		// Этот код использует фабрику для предоставления сервиса TreeGeneratorService и использует функцию inject для попытки получения экземпляра сервиса из родительского инжектора. Если экземпляр не найден, то создается новый экземпляр сервиса. Параметры optional и skipSelf определяют поведение при поиске сервиса в инжекторах.
		{
			provide: TreeService,
			useFactory: () => inject(TreeService, { optional: true, skipSelf: true }) ?? new TreeService()
		}
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgClass, forwardRef(() => AngularTreeComponent), AsyncPipe]
})
export class AngularTreeComponent implements OnInit {

	@Input() public nodes$: Observable<TreeNestedNode[]> = this.treeService.nestedTree$;

	private treeData: TreeData = {
		Groceries: {
			'Almond Meal flour': null,
			'Organic eggs': null,
			'Protein Powder': null,
			Fruits: {
				Apple: null,
				Berries: ['Blueberry', 'Raspberry'],
				Orange: null,
			},
		},
		Reminders: ['Cook dinner', 'Read the Material Design spec', 'Upgrade Application to Angular'],
		Tasks: null
	};

	constructor(
		private treeService: TreeService,
		@Inject(DOCUMENT) private document: Document
	) { }

	ngOnInit(): void {
		this.treeService.initTree(this.treeData);
	}

	public trackByFn(index: number, node: TreeNestedNode): string {
		return node.id;
	}

	public isNodeIndeterminate(node: TreeNestedNode): boolean {
		return node.state === 'indeterminate';
	}

	public isNodeChecked(node: TreeNestedNode): boolean {
		return node.state === 'checked';
	}

	public onNodeCheckedChange(event: Event, node: TreeNestedNode) {
		const oppositeState: TreeNodeStateEditable = node.state === 'unchecked' || node.state === 'indeterminate' ? 'checked' : 'unchecked';

		this.treeService.setState(node.id, oppositeState);
	}

	public transfromChildIntoObs(nodes: TreeNestedNode[]): Observable<TreeNestedNode[]> {
		return of(nodes);
	}

	public expandNodeToggle(node: TreeNestedNode): void {
		const expandableClosed = !node.expandableClosed;

		this.treeService.setExpandableClosed(node.id, expandableClosed);

		const liNode = this.document.querySelector(`li[node-id="${node.id}"]`);
		const nextTreeNode = liNode?.querySelector('.next-tree');

		if (nextTreeNode === undefined || nextTreeNode === null) return;

		const duration = 0.3;

		if (expandableClosed === true) {
			gsap.to(nextTreeNode, { 'height': 0, duration: duration });
		} else {
			gsap.to(nextTreeNode, { 'height': 'auto', duration: duration })
		}
	}

}
