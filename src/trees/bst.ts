import { BSTNode } from '../types/tree';

export interface SearchResult {
  found: boolean;
  node: BSTNode | null;
  path: number[];
  comparisons: number;
}

export class BinarySearchTree {
  private root: BSTNode | null = null;

  /**
   * Duplicate Policy:
   * "Strict Unique Keys" - Duplicate keys are rejected. In computer networking,
   * device IDs and hardware registry keys must be unique. Attempting to insert
   * a duplicate key throws a duplicate key error or returns false.
   */
  public static readonly DUPLICATE_POLICY = 'Strict Unique Keys: Rejects duplicate keys to maintain unique network device identification.';

  constructor(initialNodes?: Omit<BSTNode, 'left' | 'right'>[]) {
    if (initialNodes && initialNodes.length > 0) {
      for (const node of initialNodes) {
        this.insert(node);
      }
    }
  }

  public getRoot(): BSTNode | null {
    return this.root;
  }

  public clear(): void {
    this.root = null;
  }

  /**
   * Insert a new node into the BST
   */
  public insert(data: Omit<BSTNode, 'left' | 'right'>): boolean {
    const newNode: BSTNode = {
      ...data,
      left: null,
      right: null,
    };

    if (!this.root) {
      this.root = newNode;
      return true;
    }

    let current = this.root;
    while (true) {
      if (data.key === current.key) {
        throw new Error(`Duplicate key error: Device key ${data.key} already exists in registry.`);
      }

      if (data.key < current.key) {
        if (!current.left) {
          current.left = newNode;
          return true;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return true;
        }
        current = current.right;
      }
    }
  }

  /**
   * Search for a key and return detailed path & comparison statistics
   */
  public search(key: number): SearchResult {
    const path: number[] = [];
    let current = this.root;
    let comparisons = 0;

    while (current) {
      comparisons++;
      path.push(current.key);

      if (key === current.key) {
        return {
          found: true,
          node: current,
          path,
          comparisons,
        };
      }

      if (key < current.key) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return {
      found: false,
      node: null,
      path,
      comparisons,
    };
  }

  /**
   * Deletion handling all 3 BST cases:
   * 1. Node is a leaf
   * 2. Node has one child
   * 3. Node has two children (replaced by in-order successor)
   */
  public delete(key: number): boolean {
    let deleted = false;

    const deleteRecursively = (node: BSTNode | null, targetKey: number): BSTNode | null => {
      if (!node) return null;

      if (targetKey < node.key) {
        node.left = deleteRecursively(node.left, targetKey);
        return node;
      } else if (targetKey > node.key) {
        node.right = deleteRecursively(node.right, targetKey);
        return node;
      } else {
        deleted = true;

        // Case 1: Leaf node
        if (!node.left && !node.right) {
          return null;
        }

        // Case 2: One child
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        // Case 3: Two children
        // Find in-order successor (minimum node in right subtree)
        let successor = node.right;
        while (successor.left) {
          successor = successor.left;
        }

        // Copy successor data to current node
        node.key = successor.key;
        node.id = successor.id;
        node.name = successor.name;
        node.ip = successor.ip;
        node.deviceType = successor.deviceType;
        node.status = successor.status;

        // Delete the in-order successor from right subtree
        node.right = deleteRecursively(node.right, successor.key);
        return node;
      }
    };

    this.root = deleteRecursively(this.root, key);
    return deleted;
  }

  /**
   * Minimum key node in BST
   */
  public findMin(node: BSTNode | null = this.root): BSTNode | null {
    if (!node) return null;
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }

  /**
   * Maximum key node in BST
   */
  public findMax(node: BSTNode | null = this.root): BSTNode | null {
    if (!node) return null;
    let current = node;
    while (current.right) {
      current = current.right;
    }
    return current;
  }

  /**
   * Inorder Successor: Smallest node with key > given key
   */
  public findSuccessor(key: number): BSTNode | null {
    let successor: BSTNode | null = null;
    let current = this.root;

    while (current) {
      if (key < current.key) {
        successor = current;
        current = current.left;
      } else if (key > current.key) {
        current = current.right;
      } else {
        if (current.right) {
          successor = this.findMin(current.right);
        }
        break;
      }
    }
    return successor;
  }

  /**
   * Inorder Predecessor: Largest node with key < given key
   */
  public findPredecessor(key: number): BSTNode | null {
    let predecessor: BSTNode | null = null;
    let current = this.root;

    while (current) {
      if (key > current.key) {
        predecessor = current;
        current = current.right;
      } else if (key < current.key) {
        current = current.left;
      } else {
        if (current.left) {
          predecessor = this.findMax(current.left);
        }
        break;
      }
    }
    return predecessor;
  }

  /**
   * Range Query: Returns all nodes where key is in [minKey, maxKey]
   */
  public rangeQuery(minKey: number, maxKey: number, node: BSTNode | null = this.root): BSTNode[] {
    const results: BSTNode[] = [];
    if (!node) return results;

    if (node.key > minKey && node.left) {
      results.push(...this.rangeQuery(minKey, maxKey, node.left));
    }

    if (node.key >= minKey && node.key <= maxKey) {
      results.push(node);
    }

    if (node.key < maxKey && node.right) {
      results.push(...this.rangeQuery(minKey, maxKey, node.right));
    }

    return results;
  }

  /**
   * Height calculation: Max edges from node to leaf
   */
  public calculateHeight(node: BSTNode | null = this.root): number {
    if (!node) return -1;
    return 1 + Math.max(this.calculateHeight(node.left), this.calculateHeight(node.right));
  }

  public countNodes(node: BSTNode | null = this.root): number {
    if (!node) return 0;
    return 1 + this.countNodes(node.left) + this.countNodes(node.right);
  }

  /**
   * Inorder Traversal: Left -> Root -> Right (Produces sorted keys)
   */
  public inorderTraversal(node: BSTNode | null = this.root): BSTNode[] {
    if (!node) return [];
    return [
      ...this.inorderTraversal(node.left),
      node,
      ...this.inorderTraversal(node.right),
    ];
  }

  /**
   * Preorder Traversal: Root -> Left -> Right
   */
  public preorderTraversal(node: BSTNode | null = this.root): BSTNode[] {
    if (!node) return [];
    return [
      node,
      ...this.preorderTraversal(node.left),
      ...this.preorderTraversal(node.right),
    ];
  }

  /**
   * Postorder Traversal: Left -> Right -> Root
   */
  public postorderTraversal(node: BSTNode | null = this.root): BSTNode[] {
    if (!node) return [];
    return [
      ...this.postorderTraversal(node.left),
      ...this.postorderTraversal(node.right),
      node,
    ];
  }

  /**
   * Validate BST property: Every left child key < node key < every right child key
   */
  public isValidBST(node: BSTNode | null = this.root, min = -Infinity, max = Infinity): boolean {
    if (!node) return true;
    if (node.key <= min || node.key >= max) return false;
    return (
      this.isValidBST(node.left, min, node.key) &&
      this.isValidBST(node.right, node.key, max)
    );
  }

  /**
   * Generate default sample BST of network devices
   */
  public static createDefaultRegistry(): BinarySearchTree {
    const bst = new BinarySearchTree();
    const defaultDevices: Omit<BSTNode, 'left' | 'right'>[] = [
      { key: 50, id: 'dev-50', name: 'Gateway Alpha', ip: '192.168.1.1', deviceType: 'gateway', status: 'online' },
      { key: 30, id: 'dev-30', name: 'Switch Floor 1', ip: '192.168.1.30', deviceType: 'switch', status: 'online' },
      { key: 70, id: 'dev-70', name: 'Switch Floor 2', ip: '192.168.1.70', deviceType: 'switch', status: 'online' },
      { key: 20, id: 'dev-20', name: 'Firewall DMZ', ip: '192.168.1.20', deviceType: 'firewall', status: 'online' },
      { key: 40, id: 'dev-40', name: 'DNS Server', ip: '192.168.1.40', deviceType: 'server', status: 'online' },
      { key: 60, id: 'dev-60', name: 'Database Server', ip: '192.168.1.60', deviceType: 'server', status: 'online' },
      { key: 80, id: 'dev-80', name: 'Border Router Beta', ip: '192.168.1.80', deviceType: 'router', status: 'online' },
      { key: 10, id: 'dev-10', name: 'Audit Host', ip: '192.168.1.10', deviceType: 'workstation', status: 'offline' },
      { key: 25, id: 'dev-25', name: 'Security Gateway', ip: '192.168.1.25', deviceType: 'gateway', status: 'online' },
    ];

    for (const dev of defaultDevices) {
      bst.insert(dev);
    }
    return bst;
  }
}
