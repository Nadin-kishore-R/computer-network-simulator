import { Graph } from './graph';
import { DijkstraResult, DijkstraStep } from '../types/graph';

export interface PriorityQueueItem {
  id: string;
  priority: number;
}

/**
 * Min-Binary Heap Priority Queue implemented from scratch
 */
export class MinPriorityQueue {
  private heap: PriorityQueueItem[] = [];

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public size(): number {
    return this.heap.length;
  }

  public insert(id: string, priority: number): void {
    this.heap.push({ id, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  public extractMin(): PriorityQueueItem | undefined {
    if (this.isEmpty()) return undefined;
    const min = this.heap[0];
    const end = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return min;
  }

  private bubbleUp(index: number): void {
    let idx = index;
    const element = this.heap[idx];

    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.heap[parentIdx];

      if (element.priority >= parent.priority) break;

      this.heap[idx] = parent;
      this.heap[parentIdx] = element;
      idx = parentIdx;
    }
  }

  private sinkDown(index: number): void {
    let idx = index;
    const length = this.heap.length;
    const element = this.heap[idx];

    while (true) {
      const leftChildIdx = 2 * idx + 1;
      const rightChildIdx = 2 * idx + 2;
      let swapIdx: number | null = null;

      if (leftChildIdx < length) {
        if (this.heap[leftChildIdx].priority < element.priority) {
          swapIdx = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        if (
          (swapIdx === null && this.heap[rightChildIdx].priority < element.priority) ||
          (swapIdx !== null && this.heap[rightChildIdx].priority < this.heap[leftChildIdx].priority)
        ) {
          swapIdx = rightChildIdx;
        }
      }

      if (swapIdx === null) break;

      this.heap[idx] = this.heap[swapIdx];
      this.heap[swapIdx] = element;
      idx = swapIdx;
    }
  }
}

export class Dijkstra {
  public static compute(graph: Graph, sourceId: string, destinationId?: string): DijkstraResult {
    // 1. Validation: Verify source exists
    const vertices = graph.getAllVertices();
    const vertexIds = vertices.map((v) => v.id);

    if (!vertexIds.includes(sourceId)) {
      throw new Error(`Source vertex "${sourceId}" does not exist in the network.`);
    }

    if (destinationId && !vertexIds.includes(destinationId)) {
      throw new Error(`Destination vertex "${destinationId}" does not exist in the network.`);
    }

    // 2. Strict Requirement: Negative edge weight validation
    const allEdges = graph.getAllEdges();
    for (const edge of allEdges) {
      if (edge.weight < 0) {
        throw new Error(
          `Dijkstra's algorithm rejected: Negative edge weight (${edge.weight}) detected on link "${edge.source} -> ${edge.target}". Dijkstra requires non-negative link metrics.`
        );
      }
    }

    // 3. Initialize Distance Table, Settled Set, and Previous Pointers
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const settledSet = new Set<string>();
    const settledOrder: string[] = [];
    const steps: DijkstraStep[] = [];

    for (const vId of vertexIds) {
      distances[vId] = Infinity;
      previous[vId] = null;
    }

    distances[sourceId] = 0;

    const pq = new MinPriorityQueue();
    pq.insert(sourceId, 0);

    let stepCount = 0;
    steps.push({
      step: ++stepCount,
      currentVertex: sourceId,
      currentDistanceTable: { ...distances },
      previousTable: { ...previous },
      settled: [],
      unsettled: [sourceId],
      description: `Initialized Dijkstra: Source "${sourceId}" distance set to 0. All other nodes initialized to ∞.`,
    });

    // 4. Relax edges greedily
    while (!pq.isEmpty()) {
      const minItem = pq.extractMin()!;
      const u = minItem.id;
      const distU = minItem.priority;

      // Skip outdated duplicates in PQ
      if (distU > distances[u]) continue;
      if (settledSet.has(u)) continue;

      settledSet.add(u);
      settledOrder.push(u);

      steps.push({
        step: ++stepCount,
        currentVertex: u,
        currentDistanceTable: { ...distances },
        previousTable: { ...previous },
        settled: Array.from(settledSet),
        unsettled: vertexIds.filter((id) => !settledSet.has(id)),
        description: `Settled vertex "${u}" with finalized minimum distance ${distances[u]}.`,
      });

      // If specific destination is settled, we can conclude early (optimality guaranteed)
      if (destinationId && u === destinationId) {
        break;
      }

      const neighbors = graph.getNeighbors(u);
      for (const edge of neighbors) {
        const v = edge.target;
        if (settledSet.has(v)) continue;

        const newDist = distances[u] + edge.weight;
        if (newDist < distances[v]) {
          const oldDist = distances[v];
          distances[v] = newDist;
          previous[v] = u;
          pq.insert(v, newDist);

          steps.push({
            step: ++stepCount,
            currentVertex: u,
            evaluatedNeighbor: v,
            edgeRelaxed: { from: u, to: v, oldDist, newDist },
            currentDistanceTable: { ...distances },
            previousTable: { ...previous },
            settled: Array.from(settledSet),
            unsettled: vertexIds.filter((id) => !settledSet.has(id)),
            description: `Relaxed edge (${u} -> ${v}, weight ${edge.weight}): Reduced distance of "${v}" from ${oldDist === Infinity ? '∞' : oldDist} to ${newDist}. Previous hop set to "${u}".`,
          });
        }
      }
    }

    // 5. Reconstruct Path if destination is requested
    let shortestPath: string[] = [];
    let shortestDistance = 0;
    let isReachable = true;

    if (destinationId) {
      if (sourceId === destinationId) {
        shortestPath = [sourceId];
        shortestDistance = 0;
        isReachable = true;
      } else if (distances[destinationId] === Infinity) {
        shortestPath = [];
        shortestDistance = Infinity;
        isReachable = false;
      } else {
        shortestDistance = distances[destinationId];
        let curr: string | null = destinationId;
        while (curr !== null) {
          shortestPath.unshift(curr);
          curr = previous[curr];
        }
        isReachable = true;
      }
    }

    return {
      source: sourceId,
      destination: destinationId,
      distances,
      previous,
      shortestPath,
      shortestDistance,
      isReachable,
      steps,
      settledOrder,
    };
  }
}
