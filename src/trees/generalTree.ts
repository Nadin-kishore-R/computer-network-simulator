import { GeneralTreeNode } from '../types/tree';

export class GeneralTree {
  private root: GeneralTreeNode | null = null;

  constructor(rootData?: Omit<GeneralTreeNode, 'children'>) {
    if (rootData) {
      this.createRoot(rootData);
    }
  }

  /**
   * Initialize or replace the root node of the tree
   */
  public createRoot(data: Omit<GeneralTreeNode, 'children'>): GeneralTreeNode {
    this.root = {
      ...data,
      children: [],
    };
    return this.root;
  }

  public getRoot(): GeneralTreeNode | null {
    return this.root;
  }

  public clear(): void {
    this.root = null;
  }

  /**
   * Search for a node by ID anywhere in the hierarchy
   */
  public findNode(id: string, node: GeneralTreeNode | null = this.root): GeneralTreeNode | null {
    if (!node) return null;
    if (node.id === id) return node;

    for (const child of node.children) {
      const found = this.findNode(id, child);
      if (found) return found;
    }
    return null;
  }

  /**
   * Search for parent of a given node ID
   */
  public findParent(
    targetId: string,
    current: GeneralTreeNode | null = this.root,
    parent: GeneralTreeNode | null = null
  ): GeneralTreeNode | null {
    if (!current) return null;
    if (current.id === targetId) return parent;

    for (const child of current.children) {
      const foundParent = this.findParent(targetId, child, current);
      if (foundParent) return foundParent;
    }
    return null;
  }

  /**
   * Add a child node under a parent ID
   */
  public addChild(parentId: string, childData: Omit<GeneralTreeNode, 'children'>): boolean {
    const parent = this.findNode(parentId);
    if (!parent) {
      throw new Error(`Parent node with ID "${parentId}" not found in network hierarchy.`);
    }

    if (this.findNode(childData.id)) {
      throw new Error(`Node with ID "${childData.id}" already exists in the hierarchy.`);
    }

    const newNode: GeneralTreeNode = {
      ...childData,
      children: [],
    };

    parent.children.push(newNode);
    return true;
  }

  /**
   * Remove a node and its entire subtree
   */
  public removeNode(id: string): boolean {
    if (!this.root) return false;

    if (this.root.id === id) {
      this.root = null;
      return true;
    }

    const parent = this.findParent(id);
    if (!parent) return false;

    const initialLength = parent.children.length;
    parent.children = parent.children.filter((child) => child.id !== id);
    return parent.children.length < initialLength;
  }

  /**
   * Calculate height of a specific node (max distance to a descendant leaf).
   * Leaf node height is 0. Height of empty tree is -1.
   */
  public calculateHeight(node: GeneralTreeNode | null = this.root): number {
    if (!node) return -1;
    if (node.children.length === 0) return 0;

    let maxHeight = 0;
    for (const child of node.children) {
      const childHeight = this.calculateHeight(child);
      if (childHeight > maxHeight) {
        maxHeight = childHeight;
      }
    }
    return maxHeight + 1;
  }

  /**
   * Calculate depth of a node from the root (root depth is 0)
   */
  public calculateDepth(id: string, current: GeneralTreeNode | null = this.root, currentDepth = 0): number {
    if (!current) return -1;
    if (current.id === id) return currentDepth;

    for (const child of current.children) {
      const depth = this.calculateDepth(id, child, currentDepth + 1);
      if (depth !== -1) return depth;
    }
    return -1;
  }

  /**
   * Calculate total number of nodes in the tree
   */
  public countNodes(node: GeneralTreeNode | null = this.root): number {
    if (!node) return 0;
    let count = 1;
    for (const child of node.children) {
      count += this.countNodes(child);
    }
    return count;
  }

  /**
   * Preorder traversal: Visit node, then traverse all children left-to-right
   */
  public preorderTraversal(node: GeneralTreeNode | null = this.root): GeneralTreeNode[] {
    if (!node) return [];
    const result: GeneralTreeNode[] = [node];
    for (const child of node.children) {
      result.push(...this.preorderTraversal(child));
    }
    return result;
  }

  /**
   * Postorder traversal: Traverse all children left-to-right, then visit node
   */
  public postorderTraversal(node: GeneralTreeNode | null = this.root): GeneralTreeNode[] {
    if (!node) return [];
    const result: GeneralTreeNode[] = [];
    for (const child of node.children) {
      result.push(...this.postorderTraversal(child));
    }
    result.push(node);
    return result;
  }

  /**
   * Level-order traversal (BFS) using queue
   */
  public levelOrderTraversal(): GeneralTreeNode[] {
    if (!this.root) return [];
    const result: GeneralTreeNode[] = [];
    const queue: GeneralTreeNode[] = [this.root];

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);
      for (const child of current.children) {
        queue.push(child);
      }
    }
    return result;
  }

  /**
   * Returns a default hierarchical network setup matching the requirements:
   * Network -> Main Router -> Dept A (Switch A1, Switch A2) -> Dept B (Switch B1, Switch B2)
   */
  public static createDefaultNetwork(): GeneralTree {
    const tree = new GeneralTree({
      id: 'net-root',
      name: 'Global Enterprise Network',
      type: 'network-root',
      metadata: { domain: 'corp.local' },
    });

    tree.addChild('net-root', {
      id: 'core-router',
      name: 'Core Border Router',
      type: 'router',
      ip: '10.0.0.1',
      bandwidthMbps: 10000,
    });

    tree.addChild('core-router', {
      id: 'dept-a',
      name: 'Engineering Department (A)',
      type: 'department',
      ip: '10.1.0.0/16',
    });

    tree.addChild('dept-a', {
      id: 'switch-a1',
      name: 'Distribution Switch A1',
      type: 'switch',
      ip: '10.1.1.1',
      bandwidthMbps: 1000,
    });

    tree.addChild('switch-a1', {
      id: 'srv-build',
      name: 'CI/CD Build Server',
      type: 'server',
      ip: '10.1.1.50',
    });

    tree.addChild('dept-a', {
      id: 'switch-a2',
      name: 'Access Switch A2',
      type: 'switch',
      ip: '10.1.2.1',
      bandwidthMbps: 1000,
    });

    tree.addChild('core-router', {
      id: 'dept-b',
      name: 'Operations Department (B)',
      type: 'department',
      ip: '10.2.0.0/16',
    });

    tree.addChild('dept-b', {
      id: 'switch-b1',
      name: 'Distribution Switch B1',
      type: 'switch',
      ip: '10.2.1.1',
      bandwidthMbps: 1000,
    });

    tree.addChild('dept-b', {
      id: 'switch-b2',
      name: 'Access Switch B2',
      type: 'switch',
      ip: '10.2.2.1',
      bandwidthMbps: 1000,
    });

    return tree;
  }
}
