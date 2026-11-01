/**
 * Disjoint Set Union (DSU) / Partition Set
 * Featuring:
 * 1. Path Compression (amortized nearly O(1) finds via α(n))
 * 2. Union by Rank / Size
 */
export class DisjointSetUnion {
  private parent: Map<string, string> = new Map();
  private rank: Map<string, number> = new Map();
  private count: number;

  constructor(elements: string[]) {
    this.count = elements.length;
    for (const elem of elements) {
      this.parent.set(elem, elem);
      this.rank.set(elem, 0);
    }
  }

  /**
   * Find with recursive Path Compression:
   * Flattens the tree so all visited nodes point directly to the representative root.
   */
  public find(x: string): string {
    if (!this.parent.has(x)) {
      throw new Error(`Element "${x}" not found in Disjoint Set.`);
    }

    if (this.parent.get(x) !== x) {
      const root = this.find(this.parent.get(x)!);
      this.parent.set(x, root); // Path compression
    }
    return this.parent.get(x)!;
  }

  /**
   * Union by Rank:
   * Attaches the shorter tree under the root of the taller tree.
   * Returns true if two separate sets were merged, false if they were already in the same set (cycle detected).
   */
  public union(x: string, y: string): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return false; // Already in same set -> Edge would form a cycle
    }

    const rankX = this.rank.get(rootX)!;
    const rankY = this.rank.get(rootY)!;

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }

    this.count--;
    return true;
  }

  public connected(x: string, y: string): boolean {
    return this.find(x) === this.find(y);
  }

  public getCount(): number {
    return this.count;
  }
}
