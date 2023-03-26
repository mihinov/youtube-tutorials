export interface TreeNode {
	id: string;
	name: string;
	state: TreeNodeState,
	level: number;
	expandable: boolean;
	expandableClosed: boolean;
	parent: string | null;
	child: string[];
}

export interface TreeNestedNode {
	id: string;
	name: string;
	state: TreeNodeState,
	level: number;
	expandable: boolean;
	expandableClosed: boolean;
	parent: TreeNestedNode | null;
	child: TreeNestedNode[];
}

export type TreeData = {
  [key: string]: null | string[] | TreeData;
}

export type TreeNodeState = 'checked' | 'unchecked' | 'indeterminate';
export type TreeNodeStateEditable = 'checked' | 'unchecked';
