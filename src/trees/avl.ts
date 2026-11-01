import { AVLNode, RotationType, RotationStep } from '../types/tree';

export interface AVLMutationResult {
  success: boolean;
  rotations: RotationStep[];
  isBST: boolean;
  isBalanced: boolean;
  message?: string;
}

export class AVLTree {
  private root: AVLNode | null = null;
  private rotationHistory: RotationStep[] = [];

  constructor(initialNodes?: Omit<AVLNode, 'height' | 'left' | 'right'>[]) {
    if (initialNodes && initialNodes.length > 0) {
      for (const node of initialNodes) {
        this.insert(node);
      }
    }
  }

  public getRoot(): AVLNode | null {
    return this.root;
  }

  public clear(): void {
    this.root = null;
    this.rotationHistory = [];
  }

  public getRotationHistory(): RotationStep[] {
    return [...this.rotationHistory];
  }

  /**
   * Helper to deeply clone node hierarchy for step snapshots
   */
  public cloneTree(node: AVLNode | null = this.root): AVLNode | null {
    if (!node) return null;
    return {
      ...node,
      left: this.cloneTree(node.left),
      right: this.cloneTree(node.right),
    };
  }

  /**
   * Node height helper: null is 0, leaf is 1
   */
  public getHeight(node: AVLNode | null): number {
    return node ? node.height : 0;
  }

  /**
   * Balance Factor: height(left) - height(right)
   * Valid AVL range: {-1, 0, 1}
   */
  public getBalanceFactor(node: AVLNode | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  private updateHeight(node: AVLNode): void {
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  /**
   * Right Rotation (LL Rotation)
   * Applied when left subtree is taller and new node was inserted into left child's left subtree.
   */
  private rightRotate(z: AVLNode, track = true): AVLNode {
    const snapshotBefore = track ? JSON.stringify(this.cloneTree(this.root)) : undefined;
    const y = z.left!;
    const T2 = y.right;

    // Perform rotation
    y.right = z;
    z.left = T2;

    // Update heights
    this.updateHeight(z);
    this.updateHeight(y);

    if (track) {
      const step: RotationStep = {
        type: 'LL',
        unbalancedKey: z.key,
        pivotKey: y.key,
        description: `Right Rotation (LL) around node ${z.key} with pivot ${y.key} to fix Left-Left imbalance (BF was +2).`,
        timestamp: Date.now(),
        snapshotBefore,
      };
      this.rotationHistory.push(step);
    }

    return y;
  }

  /**
   * Left Rotation (RR Rotation)
   * Applied when right subtree is taller and new node was inserted into right child's right subtree.
   */
  private leftRotate(z: AVLNode, track = true): AVLNode {
    const snapshotBefore = track ? JSON.stringify(this.cloneTree(this.root)) : undefined;
    const y = z.right!;
    const T2 = y.left;

    // Perform rotation
    y.left = z;
    z.right = T2;

    // Update heights
    this.updateHeight(z);
    this.updateHeight(y);

    if (track) {
      const step: RotationStep = {
        type: 'RR',
        unbalancedKey: z.key,
        pivotKey: y.key,
        description: `Left Rotation (RR) around node ${z.key} with pivot ${y.key} to fix Right-Right imbalance (BF was -2).`,
        timestamp: Date.now(),
        snapshotBefore,
      };
      this.rotationHistory.push(step);
    }

    return y;
  }

  /**
   * Left-Right Rotation (LR Rotation)
   * Left rotate left child, then right rotate unbalanced node.
   */
  private leftRightRotate(z: AVLNode): AVLNode {
    const snapshotBefore = JSON.stringify(this.cloneTree(this.root));
    const leftChildKey = z.left!.key;
    const leftChildRightChildKey = z.left!.right!.key;

    // 1. Left rotate on left child
    z.left = this.leftRotate(z.left!, false);
    // 2. Right rotate on z
    const result = this.rightRotate(z, false);

    const step: RotationStep = {
      type: 'LR',
      unbalancedKey: z.key,
      pivotKey: leftChildRightChildKey,
      description: `Left-Right Double Rotation (LR): First left-rotated child ${leftChildKey}, then right-rotated ${z.key} using pivot ${leftChildRightChildKey}.`,
      timestamp: Date.now(),
      snapshotBefore,
      snapshotAfter: JSON.stringify(this.cloneTree(this.root)),
    };
    this.rotationHistory.push(step);

    return result;
  }

  /**
   * Right-Left Rotation (RL Rotation)
   * Right rotate right child, then left rotate unbalanced node.
   */
  private rightLeftRotate(z: AVLNode): AVLNode {
    const snapshotBefore = JSON.stringify(this.cloneTree(this.root));
    const rightChildKey = z.right!.key;
    const rightChildLeftChildKey = z.right!.left!.key;

    // 1. Right rotate on right child
    z.right = this.rightRotate(z.right!, false);
    // 2. Left rotate on z
    const result = this.leftRotate(z, false);

    const step: RotationStep = {
      type: 'RL',
      unbalancedKey: z.key,
      pivotKey: rightChildLeftChildKey,
      description: `Right-Left Double Rotation (RL): First right-rotated child ${rightChildKey}, then left-rotated ${z.key} using pivot ${rightChildLeftChildKey}.`,
      timestamp: Date.now(),
      snapshotBefore,
      snapshotAfter: JSON.stringify(this.cloneTree(this.root)),
    };
    this.rotationHistory.push(step);

    return result;
  }

  /**
   * Insert node with automatic rebalancing
   */
  public insert(data: Omit<AVLNode, 'height' | 'left' | 'right'>): AVLMutationResult {
    const initialRotationsCount = this.rotationHistory.length;

    const insertNode = (node: AVLNode | null): AVLNode => {
      // 1. Standard BST insertion
      if (!node) {
        return {
          ...data,
          height: 1,
          left: null,
          right: null,
        };
      }

      if (data.key === node.key) {
        throw new Error(`Duplicate key ${data.key}: AVL tree maintains strictly unique network device keys.`);
      }

      if (data.key < node.key) {
        node.left = insertNode(node.left);
      } else {
        node.right = insertNode(node.right);
      }

      // 2. Update height of ancestor node
      this.updateHeight(node);

      // 3. Get balance factor to check whether this node became unbalanced
      const balance = this.getBalanceFactor(node);

      // Case 1: Left-Left (LL)
      if (balance > 1 && data.key < node.left!.key) {
        return this.rightRotate(node);
      }

      // Case 2: Right-Right (RR)
      if (balance < -1 && data.key > node.right!.key) {
        return this.leftRotate(node);
      }

      // Case 3: Left-Right (LR)
      if (balance > 1 && data.key > node.left!.key) {
        return this.leftRightRotate(node);
      }

      // Case 4: Right-Left (RL)
      if (balance < -1 && data.key < node.right!.key) {
        return this.rightLeftRotate(node);
      }

      return node;
    };

    this.root = insertNode(this.root);

    // Post-mutation verifications
    const isBST = this.verifyBST(this.root);
    const isBalanced = this.verifyAVLBalance(this.root);
    const newRotations = this.rotationHistory.slice(initialRotationsCount);

    return {
      success: true,
      rotations: newRotations,
      isBST,
      isBalanced,
      message: newRotations.length > 0
        ? `Inserted key ${data.key}. Rebalanced using ${newRotations.map((r) => r.type).join(', ')} rotation(s).`
        : `Inserted key ${data.key}. Tree remained balanced.`,
    };
  }

  /**
   * Delete node by key with automatic rebalancing
   */
  public delete(key: number): AVLMutationResult {
    const initialRotationsCount = this.rotationHistory.length;
    let found = false;

    const deleteNode = (node: AVLNode | null, targetKey: number): AVLNode | null => {
      if (!node) return null;

      if (targetKey < node.key) {
        node.left = deleteNode(node.left, targetKey);
      } else if (targetKey > node.key) {
        node.right = deleteNode(node.right, targetKey);
      } else {
        found = true;

        // Node with only one child or no child
        if (!node.left || !node.right) {
          const temp = node.left ? node.left : node.right;
          if (!temp) {
            // No child case
            return null;
          } else {
            // One child case
            return temp;
          }
        } else {
          // Node with two children: Get the inorder successor (smallest in right subtree)
          let successor = node.right;
          while (successor.left) {
            successor = successor.left;
          }

          // Copy successor data to this node
          node.key = successor.key;
          node.id = successor.id;
          node.name = successor.name;
          node.ip = successor.ip;
          node.deviceType = successor.deviceType;
          node.status = successor.status;

          // Delete the inorder successor
          node.right = deleteNode(node.right, successor.key);
        }
      }

      // Update height
      this.updateHeight(node);

      // Check balance
      const balance = this.getBalanceFactor(node);

      // LL Case
      if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
        return this.rightRotate(node);
      }

      // LR Case
      if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
        return this.leftRightRotate(node);
      }

      // RR Case
      if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
        return this.leftRotate(node);
      }

      // RL Case
      if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
        return this.rightLeftRotate(node);
      }

      return node;
    };

    this.root = deleteNode(this.root, key);

    const isBST = this.verifyBST(this.root);
    const isBalanced = this.verifyAVLBalance(this.root);
    const newRotations = this.rotationHistory.slice(initialRotationsCount);

    return {
      success: found,
      rotations: newRotations,
      isBST,
      isBalanced,
      message: found
        ? `Deleted key ${key}.${newRotations.length > 0 ? ` Balanced with ${newRotations.map((r) => r.type).join(', ')}.` : ''}`
        : `Key ${key} not found for deletion.`,
    };
  }

  /**
   * Search for a key
   */
  public search(key: number): { found: boolean; node: AVLNode | null; path: number[] } {
    const path: number[] = [];
    let current = this.root;

    while (current) {
      path.push(current.key);
      if (key === current.key) {
        return { found: true, node: current, path };
      }
      if (key < current.key) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return { found: false, node: null, path };
  }

  /**
   * Verifies BST property: In-order traversal must be strictly ascending
   */
  public verifyBST(node: AVLNode | null = this.root, min = -Infinity, max = Infinity): boolean {
    if (!node) return true;
    if (node.key <= min || node.key >= max) return false;
    return this.verifyBST(node.left, min, node.key) && this.verifyBST(node.right, node.key, max);
  }

  /**
   * Verifies AVL balance condition: |height(left) - height(right)| <= 1 for all nodes
   */
  public verifyAVLBalance(node: AVLNode | null = this.root): boolean {
    if (!node) return true;
    const bf = this.getBalanceFactor(node);
    if (Math.abs(bf) > 1) return false;
    return this.verifyAVLBalance(node.left) && this.verifyAVLBalance(node.right);
  }

  /**
   * Inorder traversal (Left, Root, Right)
   */
  public inorderTraversal(node: AVLNode | null = this.root): AVLNode[] {
    if (!node) return [];
    return [...this.inorderTraversal(node.left), node, ...this.inorderTraversal(node.right)];
  }

  /**
   * Preorder traversal (Root, Left, Right)
   */
  public preorderTraversal(node: AVLNode | null = this.root): AVLNode[] {
    if (!node) return [];
    return [node, ...this.preorderTraversal(node.left), ...this.preorderTraversal(node.right)];
  }

  /**
   * Postorder traversal (Left, Right, Root)
   */
  public postorderTraversal(node: AVLNode | null = this.root): AVLNode[] {
    if (!node) return [];
    return [...this.postorderTraversal(node.left), ...this.postorderTraversal(node.right), node];
  }

  public countNodes(node: AVLNode | null = this.root): number {
    if (!node) return 0;
    return 1 + this.countNodes(node.left) + this.countNodes(node.right);
  }

  /**
   * Generate default balanced AVL device registry
   */
  public static createDefaultRegistry(): AVLTree {
    const avl = new AVLTree();
    const items: Omit<AVLNode, 'height' | 'left' | 'right'>[] = [
      { key: 10, id: 'node-10', name: 'Workstation 10', ip: '192.168.10.1', deviceType: 'workstation', status: 'online' },
      { key: 20, id: 'node-20', name: 'Switch 20', ip: '192.168.20.1', deviceType: 'switch', status: 'online' },
      { key: 30, id: 'node-30', name: 'Router 30', ip: '192.168.30.1', deviceType: 'router', status: 'online' },
      { key: 40, id: 'node-40', name: 'Firewall 40', ip: '192.168.40.1', deviceType: 'firewall', status: 'online' },
      { key: 50, id: 'node-50', name: 'Core Gateway 50', ip: '192.168.50.1', deviceType: 'gateway', status: 'online' },
      { key: 25, id: 'node-25', name: 'Cache Server 25', ip: '192.168.25.1', deviceType: 'server', status: 'online' },
    ];

    for (const item of items) {
      avl.insert(item);
    }
    return avl;
  }
}
