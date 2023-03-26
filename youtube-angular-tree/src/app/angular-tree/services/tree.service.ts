import { Injectable } from '@angular/core';
import { TreeData, TreeNestedNode, TreeNode, TreeNodeState, TreeNodeStateEditable } from '../angular-tree.types';
import { BehaviorSubject, Observable, takeWhile } from 'rxjs';

@Injectable()
export class TreeService {

  private tree: Map<string, TreeNode> | null = null;
  private _subjTree: BehaviorSubject<Map<string, TreeNode> | null> = new BehaviorSubject<Map<string, TreeNode> | null>(null);
  private _subjNestedTree: BehaviorSubject<TreeNestedNode[]> = new BehaviorSubject<TreeNestedNode[]>([]);
  public tree$: Observable<Map<string, TreeNode>> = this._subjTree.pipe(
    takeWhile(item => item !== null)
  ) as Observable<Map<string, TreeNode>>;
  public nestedTree$: Observable<TreeNestedNode[]> = this._subjNestedTree.asObservable();
  public createdTreeBool: boolean = false;

  constructor() { }

  public initTree(data: TreeData): Map<string, TreeNode> {

    if (this.createdTreeBool === true) {
      return this.tree as Map<string, TreeNode>;
    }

    this.tree = this.generateTree(data, 0);
    this.createdTreeBool = true;

    this.updateTree();

    return this.tree;
  }

  private generateTree(data: TreeData, level: number, parent: string | null = null): Map<string, TreeNode> {
    const tree = new Map<string, TreeNode>();

    for (const key in data) {
      const dataItem = data[key];
      const id = window.crypto.randomUUID();
      const child: string[] = [];

      if (Array.isArray(dataItem) && dataItem.length !== 0) {
        child.push(...this.generateChildIdNodes(dataItem, level + 1, id, tree));
      } else if (dataItem !== null && typeof dataItem === 'object' && !Array.isArray(dataItem)) {
        const childTree = this.generateTree(dataItem, level + 1, id);

        for (const [idChild, valueChild] of childTree) {
          tree.set(idChild, valueChild);
          if (valueChild.parent === id) child.push(idChild);
        }
      }

      tree.set(id, {
        id: id,
        name: key,
        level: level,
        expandable: child.length !== 0,
        expandableClosed: false,
        child: child,
        parent: parent,
        state: 'unchecked'
      });

    }

    return tree;
  }

  private generateChildIdNodes(data: string[], level: number, parentId: string, tree: Map<string, TreeNode>): string[] {
    const idNodes = [];

    for (const key of data) {
      const id = window.crypto.randomUUID();

      const node: TreeNode = {
        id: id,
        name: key,
        level: level,
        parent: parentId,
        expandable: false,
        expandableClosed: false,
        state: 'unchecked',
        child: []
      };

      tree.set(id, node);
      idNodes.push(id);
    }

    return idNodes;
  }

  public getNodeById(idNode: string): TreeNode | null {
    if (this.tree === null) return null;

    const node = this.tree.get(idNode);
    if (node === undefined) return null;

    return node;
  }

  public getChildNodesFromNode(idNode: string): TreeNode[] {
    if (this.tree === null) return [];

    const node = this.getNodeById(idNode);
    if (node === null || node.child.length === 0) return [];

    const childNodes = node.child.map(idChild => this.getNodeById(idChild)).filter(item => item !== null) as TreeNode[];

    return childNodes;
  }

  public getParentNode(idNode: string) {
    if (this.tree === null) return null;

    const node = this.getNodeById(idNode);
    if (node === null || node.parent === null) return null;

    const parentNode = this.getNodeById(node.parent);
    if (parentNode === null) return null;

    return parentNode;
  }

  public getNodesByLevel(level: number): TreeNode[] {
    if (this.tree === null) return [];

    const nodes: TreeNode[] = [];

    for (const [key, value] of this.tree) {
      const node = this.getNodeById(key);

      if (node === null) continue;
      if (node.level === level) {
        nodes.push(node);
      }
    }

    return nodes;
  }

  public getNestedTree() {
    if (this.tree === null) return [];

    const nodesFromLevel0: TreeNode[] = this.getNodesByLevel(0);
    const nestedNodes = nodesFromLevel0.map(flatNode => this.createNestedNode(flatNode));

    return nestedNodes;
  }

  private createNestedNode(node: TreeNode, parentNestedNode: TreeNestedNode | null = null): TreeNestedNode {

    const nestedNode: TreeNestedNode = {
      id: node.id,
      name: node.name,
      state: node.state,
      level: node.level,
      expandable: node.expandable,
      expandableClosed: node.expandableClosed,
      child: [],
      parent: parentNestedNode
    };

    const childFlatNodes = this.getChildNodesFromNode(node.id);
    const childNestedNodes = childFlatNodes.map(flatNode => this.createNestedNode(flatNode, nestedNode));

    nestedNode.child.push(...childNestedNodes);

    return nestedNode;
  }

  public setState(idNode: string, state: TreeNodeStateEditable): void {
    if (this.tree === null) return;
    const node = this.getNodeById(idNode);
    if (node === null) return;

    node.state = state;
    this.tree.set(node.id, node);
    this.setStateChildNodes(node, state);
    this.setStateParentNodes(node);
    this.updateTree();
  }

  private setStateChildNodes(node: TreeNode, state: TreeNodeStateEditable): void {
    if (this.tree === null) return;
    if (node.child.length === 0) return;

    const childNodes = this.getChildNodesFromNode(node.id);

    for (const childNode of childNodes) {
      childNode.state = state;
      this.tree.set(childNode.id, childNode);
      this.setStateChildNodes(childNode, state);
    }
  }

  private setStateParentNodes(node: TreeNode): void {
    if (this.tree === null) return;
    const parentNode = this.getParentNode(node.id);
    if (parentNode === null) return;

    const childNodes = this.getChildNodesFromNode(parentNode.id);
    let parentNodeState: TreeNodeState | null = null;
    const checkedChildNodesCount = childNodes.reduce((acc, curr) => curr.state === 'checked' ? acc + 1 : acc, 0);
    const uncheckedChildNodesCount = childNodes.reduce((acc, curr) => curr.state === 'unchecked' ? acc + 1 : acc, 0);
    const indeterminateChildNodesCount = childNodes.reduce((acc, curr) => curr.state === 'indeterminate' ? acc + 1 : acc, 0);

    if (indeterminateChildNodesCount > 0) {
      parentNodeState = 'indeterminate';
    } else if (checkedChildNodesCount > 0 && uncheckedChildNodesCount > 0) {
      parentNodeState = 'indeterminate';
    } else if (checkedChildNodesCount === childNodes.length) {
      parentNodeState = 'checked';
    } else if (uncheckedChildNodesCount === childNodes.length) {
      parentNodeState = 'unchecked';
    }

    if (parentNodeState === null) return;

    parentNode.state = parentNodeState;
    this.tree.set(parentNode.id, parentNode);
    this.setStateParentNodes(parentNode);
  }

  public setExpandableClosed(idNode: string, expandableClosed: boolean): void {
    if (this.tree === null) return;
    const node = this.getNodeById(idNode);
    if (node === null) return;

    node.expandableClosed = expandableClosed;
    this.tree.set(node.id, node);
    this.updateTree();
  }

  private updateTree(): void {
    if (this.tree === null) return;

    this._subjTree.next(this.tree);
    this._subjNestedTree.next(this.getNestedTree());
  }


}
