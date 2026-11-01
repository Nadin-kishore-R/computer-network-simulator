import { describe, it, expect, beforeEach } from 'vitest';
import { GeneralTree } from '../trees/generalTree';
import { BinarySearchTree } from '../trees/bst';
import { AVLTree } from '../trees/avl';
import { ExpressionTree } from '../trees/expressionTree';

describe('Network Hierarchy: General Tree', () => {
  let tree: GeneralTree;

  beforeEach(() => {
    tree = new GeneralTree({
      id: 'root',
      name: 'Root Network',
      type: 'network-root',
    });
  });

  it('should initialize root and compute initial height and count', () => {
    expect(tree.getRoot()?.id).toBe('root');
    expect(tree.calculateHeight()).toBe(0);
    expect(tree.countNodes()).toBe(1);
  });

  it('should add children and sub-children properly', () => {
    tree.addChild('root', { id: 'r1', name: 'Router 1', type: 'router' });
    tree.addChild('root', { id: 'r2', name: 'Router 2', type: 'router' });
    tree.addChild('r1', { id: 's1', name: 'Switch 1', type: 'switch' });

    expect(tree.countNodes()).toBe(4);
    expect(tree.calculateHeight()).toBe(2);
    expect(tree.calculateDepth('s1')).toBe(2);
    expect(tree.calculateDepth('r1')).toBe(1);
    expect(tree.calculateDepth('root')).toBe(0);
  });

  it('should find node and parent correctly', () => {
    tree.addChild('root', { id: 'dept-a', name: 'Dept A', type: 'department' });
    tree.addChild('dept-a', { id: 'sw-1', name: 'Switch 1', type: 'switch' });

    const node = tree.findNode('sw-1');
    expect(node?.name).toBe('Switch 1');

    const parent = tree.findParent('sw-1');
    expect(parent?.id).toBe('dept-a');
  });

  it('should prevent duplicate node IDs', () => {
    tree.addChild('root', { id: 'dept-a', name: 'Dept A', type: 'department' });
    expect(() => {
      tree.addChild('root', { id: 'dept-a', name: 'Duplicate Dept A', type: 'department' });
    }).toThrow();
  });

  it('should remove a node and its entire subtree', () => {
    tree.addChild('root', { id: 'dept-a', name: 'Dept A', type: 'department' });
    tree.addChild('dept-a', { id: 'sw-1', name: 'Switch 1', type: 'switch' });
    tree.addChild('sw-1', { id: 'host-1', name: 'Host 1', type: 'workstation' });

    expect(tree.countNodes()).toBe(4);
    const removed = tree.removeNode('dept-a');
    expect(removed).toBe(true);
    expect(tree.countNodes()).toBe(1);
    expect(tree.findNode('sw-1')).toBeNull();
  });

  it('should traverse in preorder, postorder, and level-order correctly', () => {
    tree.addChild('root', { id: 'A', name: 'A', type: 'department' });
    tree.addChild('root', { id: 'B', name: 'B', type: 'department' });
    tree.addChild('A', { id: 'C', name: 'C', type: 'switch' });

    const pre = tree.preorderTraversal().map((n) => n.id);
    expect(pre).toEqual(['root', 'A', 'C', 'B']);

    const post = tree.postorderTraversal().map((n) => n.id);
    expect(post).toEqual(['C', 'A', 'B', 'root']);

    const level = tree.levelOrderTraversal().map((n) => n.id);
    expect(level).toEqual(['root', 'A', 'B', 'C']);
  });
});

describe('Device Registry: Binary Search Tree (BST)', () => {
  let bst: BinarySearchTree;

  beforeEach(() => {
    bst = new BinarySearchTree();
  });

  it('should insert items and maintain sorted inorder traversal', () => {
    bst.insert({ key: 50, id: 'd50', name: 'Device 50', ip: '10.0.0.50', deviceType: 'router', status: 'online' });
    bst.insert({ key: 30, id: 'd30', name: 'Device 30', ip: '10.0.0.30', deviceType: 'switch', status: 'online' });
    bst.insert({ key: 70, id: 'd70', name: 'Device 70', ip: '10.0.0.70', deviceType: 'server', status: 'online' });
    bst.insert({ key: 20, id: 'd20', name: 'Device 20', ip: '10.0.0.20', deviceType: 'workstation', status: 'online' });
    bst.insert({ key: 40, id: 'd40', name: 'Device 40', ip: '10.0.0.40', deviceType: 'switch', status: 'online' });

    const inorderKeys = bst.inorderTraversal().map((n) => n.key);
    expect(inorderKeys).toEqual([20, 30, 40, 50, 70]);
    expect(bst.isValidBST()).toBe(true);
  });

  it('should reject duplicate keys per policy', () => {
    bst.insert({ key: 50, id: 'd50', name: 'Device 50', ip: '10.0.0.50', deviceType: 'router', status: 'online' });
    expect(() => {
      bst.insert({ key: 50, id: 'd50_dup', name: 'Duplicate 50', ip: '10.0.0.50', deviceType: 'router', status: 'online' });
    }).toThrow(/Duplicate key error/);
  });

  it('should find min, max, predecessor, and successor', () => {
    [50, 30, 70, 20, 40, 60, 80].forEach((k) => {
      bst.insert({ key: k, id: `d${k}`, name: `Device ${k}`, ip: `10.0.0.${k}`, deviceType: 'switch', status: 'online' });
    });

    expect(bst.findMin()?.key).toBe(20);
    expect(bst.findMax()?.key).toBe(80);
    expect(bst.findSuccessor(40)?.key).toBe(50);
    expect(bst.findPredecessor(40)?.key).toBe(30);
    expect(bst.findSuccessor(80)).toBeNull();
    expect(bst.findPredecessor(20)).toBeNull();
  });

  it('should perform range queries', () => {
    [50, 30, 70, 20, 40, 60, 80].forEach((k) => {
      bst.insert({ key: k, id: `d${k}`, name: `Device ${k}`, ip: `10.0.0.${k}`, deviceType: 'switch', status: 'online' });
    });

    const range = bst.rangeQuery(30, 60).map((n) => n.key);
    expect(range.sort((a, b) => a - b)).toEqual([30, 40, 50, 60]);
  });

  it('should delete leaf node (Case 1)', () => {
    [50, 30, 70].forEach((k) => {
      bst.insert({ key: k, id: `d${k}`, name: `Device ${k}`, ip: `10.0.0.${k}`, deviceType: 'switch', status: 'online' });
    });
    bst.delete(70);
    expect(bst.inorderTraversal().map((n) => n.key)).toEqual([30, 50]);
    expect(bst.isValidBST()).toBe(true);
  });

  it('should delete node with one child (Case 2)', () => {
    [50, 30, 70, 80].forEach((k) => {
      bst.insert({ key: k, id: `d${k}`, name: `Device ${k}`, ip: `10.0.0.${k}`, deviceType: 'switch', status: 'online' });
    });
    bst.delete(70);
    expect(bst.inorderTraversal().map((n) => n.key)).toEqual([30, 50, 80]);
    expect(bst.isValidBST()).toBe(true);
  });

  it('should delete node with two children (Case 3)', () => {
    [50, 30, 70, 60, 80].forEach((k) => {
      bst.insert({ key: k, id: `d${k}`, name: `Device ${k}`, ip: `10.0.0.${k}`, deviceType: 'switch', status: 'online' });
    });
    bst.delete(70); // Successor is 60 (or min of right subtree)
    expect(bst.inorderTraversal().map((n) => n.key)).toEqual([30, 50, 60, 80]);
    expect(bst.isValidBST()).toBe(true);
  });
});

describe('Self-Balancing IP Registry: AVL Tree', () => {
  let avl: AVLTree;

  beforeEach(() => {
    avl = new AVLTree();
  });

  it('should perform LL rotation (Right Rotation)', () => {
    // Insert 30, 20, 10 -> triggers LL rotation on 30
    avl.insert({ key: 30, id: 'd30', name: 'D30', ip: '10.0.0.30', deviceType: 'switch', status: 'online' });
    avl.insert({ key: 20, id: 'd20', name: 'D20', ip: '10.0.0.20', deviceType: 'switch', status: 'online' });
    const res = avl.insert({ key: 10, id: 'd10', name: 'D10', ip: '10.0.0.10', deviceType: 'switch', status: 'online' });

    expect(res.rotations.length).toBeGreaterThan(0);
    expect(res.rotations[0].type).toBe('LL');
    expect(avl.getRoot()?.key).toBe(20);
    expect(avl.verifyBST()).toBe(true);
    expect(avl.verifyAVLBalance()).toBe(true);
  });

  it('should perform RR rotation (Left Rotation)', () => {
    // Insert 10, 20, 30 -> triggers RR rotation on 10
    avl.insert({ key: 10, id: 'd10', name: 'D10', ip: '10.0.0.10', deviceType: 'switch', status: 'online' });
    avl.insert({ key: 20, id: 'd20', name: 'D20', ip: '10.0.0.20', deviceType: 'switch', status: 'online' });
    const res = avl.insert({ key: 30, id: 'd30', name: 'D30', ip: '10.0.0.30', deviceType: 'switch', status: 'online' });

    expect(res.rotations.length).toBeGreaterThan(0);
    expect(res.rotations[0].type).toBe('RR');
    expect(avl.getRoot()?.key).toBe(20);
    expect(avl.verifyBST()).toBe(true);
    expect(avl.verifyAVLBalance()).toBe(true);
  });

  it('should perform LR rotation (Left-Right Double Rotation)', () => {
    // Insert 30, 10, 20 -> triggers LR rotation on 30
    avl.insert({ key: 30, id: 'd30', name: 'D30', ip: '10.0.0.30', deviceType: 'switch', status: 'online' });
    avl.insert({ key: 10, id: 'd10', name: 'D10', ip: '10.0.0.10', deviceType: 'switch', status: 'online' });
    const res = avl.insert({ key: 20, id: 'd20', name: 'D20', ip: '10.0.0.20', deviceType: 'switch', status: 'online' });

    expect(res.rotations.some((r) => r.type === 'LR')).toBe(true);
    expect(avl.getRoot()?.key).toBe(20);
    expect(avl.verifyBST()).toBe(true);
    expect(avl.verifyAVLBalance()).toBe(true);
  });

  it('should perform RL rotation (Right-Left Double Rotation)', () => {
    // Insert 10, 30, 20 -> triggers RL rotation on 10
    avl.insert({ key: 10, id: 'd10', name: 'D10', ip: '10.0.0.10', deviceType: 'switch', status: 'online' });
    avl.insert({ key: 30, id: 'd30', name: 'D30', ip: '10.0.0.30', deviceType: 'switch', status: 'online' });
    const res = avl.insert({ key: 20, id: 'd20', name: 'D20', ip: '10.0.0.20', deviceType: 'switch', status: 'online' });

    expect(res.rotations.some((r) => r.type === 'RL')).toBe(true);
    expect(avl.getRoot()?.key).toBe(20);
    expect(avl.verifyBST()).toBe(true);
    expect(avl.verifyAVLBalance()).toBe(true);
  });

  it('should maintain AVL balance and BST property after deletions', () => {
    [10, 20, 30, 40, 50, 25].forEach((k) => {
      avl.insert({ key: k, id: `d${k}`, name: `D${k}`, ip: `10.0.0.${k}`, deviceType: 'switch', status: 'online' });
    });

    const res = avl.delete(30);
    expect(res.success).toBe(true);
    expect(avl.verifyBST()).toBe(true);
    expect(avl.verifyAVLBalance()).toBe(true);
    expect(avl.search(30).found).toBe(false);
  });
});

describe('Bandwidth Formula Evaluator: Expression Tree', () => {
  let exprTree: ExpressionTree;

  beforeEach(() => {
    exprTree = new ExpressionTree();
  });

  it('should build expression tree from postfix and generate notations', () => {
    exprTree.buildFromPostfix('100 50 + 2 *');
    expect(exprTree.toInorder()).toBe('((100 + 50) * 2)');
    expect(exprTree.toPreorder()).toBe('* + 100 50 2');
    expect(exprTree.toPostorder()).toBe('100 50 + 2 *');
  });

  it('should evaluate postfix calculation correctly with step tracking', () => {
    exprTree.buildFromPostfix('100 50 + 2 *');
    const result = exprTree.evaluate();
    expect(result.value).toBe(300);
    expect(result.steps.length).toBe(2);
    expect(result.steps[0].subExpression).toBe('100 + 50');
    expect(result.steps[0].result).toBe(150);
    expect(result.steps[1].subExpression).toBe('150 * 2');
    expect(result.steps[1].result).toBe(300);
  });

  it('should handle division by zero with safe exception', () => {
    exprTree.buildFromPostfix('100 0 /');
    expect(() => exprTree.evaluate()).toThrow(/Division by zero/);
  });

  it('should reject invalid expressions and invalid operands', () => {
    expect(() => ExpressionTree.validateAndTokenize('100 +')).toThrow(/Operator '\+' requires 2 operands/);
    expect(() => ExpressionTree.validateAndTokenize('100 50 20 +')).toThrow(/Too many operands/);
    expect(() => ExpressionTree.validateAndTokenize('100 abc +')).toThrow(/Invalid operand 'abc'/);
  });
});
