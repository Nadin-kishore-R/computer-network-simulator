import { GraphVertex, GraphEdge, GraphData } from '../types/graph';

export interface AdjacencyListEdge {
  target: string;
  weight: number;
  edgeId: string;
}

export class Graph {
  private vertices: Map<string, GraphVertex> = new Map();
  private edges: Map<string, GraphEdge> = new Map();
  private adjacencyList: Map<string, AdjacencyListEdge[]> = new Map();
  private isDirected: boolean;
  private isWeighted: boolean;

  constructor(isDirected = false, isWeighted = true) {
    this.isDirected = isDirected;
    this.isWeighted = isWeighted;
  }

  public getIsDirected(): boolean {
    return this.isDirected;
  }

  public setIsDirected(directed: boolean): void {
    this.isDirected = directed;
    this.rebuildAdjacencyList();
  }

  public getIsWeighted(): boolean {
    return this.isWeighted;
  }

  public setIsWeighted(weighted: boolean): void {
    this.isWeighted = weighted;
  }

  public clear(): void {
    this.vertices.clear();
    this.edges.clear();
    this.adjacencyList.clear();
  }

  /**
   * Add a new vertex to the network graph
   */
  public addVertex(vertex: GraphVertex): void {
    if (!vertex.id || vertex.id.trim() === '') {
      throw new Error('Vertex ID cannot be empty.');
    }
    if (this.vertices.has(vertex.id)) {
      throw new Error(`Vertex with ID "${vertex.id}" already exists in the graph.`);
    }

    this.vertices.set(vertex.id, { ...vertex });
    this.adjacencyList.set(vertex.id, []);
  }

  /**
   * Remove a vertex and all its incident edges
   */
  public removeVertex(vertexId: string): boolean {
    if (!this.vertices.has(vertexId)) {
      return false;
    }

    // Remove all edges connected to this vertex
    for (const [edgeId, edge] of this.edges.entries()) {
      if (edge.source === vertexId || edge.target === vertexId) {
        this.edges.delete(edgeId);
      }
    }

    this.vertices.delete(vertexId);
    this.adjacencyList.delete(vertexId);
    this.rebuildAdjacencyList();
    return true;
  }

  /**
   * Add an edge between source and target
   */
  public addEdge(edge: Omit<GraphEdge, 'id'> & { id?: string }): GraphEdge {
    if (!this.vertices.has(edge.source)) {
      throw new Error(`Source vertex "${edge.source}" does not exist in graph.`);
    }
    if (!this.vertices.has(edge.target)) {
      throw new Error(`Target vertex "${edge.target}" does not exist in graph.`);
    }

    const weight = this.isWeighted ? (edge.weight !== undefined ? edge.weight : 1) : 1;
    const edgeId = edge.id || `${edge.source}->${edge.target}`;

    if (this.edges.has(edgeId)) {
      throw new Error(`Edge "${edgeId}" already exists in graph.`);
    }

    const newEdge: GraphEdge = {
      ...edge,
      id: edgeId,
      weight,
    };

    this.edges.set(edgeId, newEdge);

    // Update adjacency list
    this.adjacencyList.get(edge.source)!.push({
      target: edge.target,
      weight,
      edgeId,
    });

    if (!this.isDirected && edge.source !== edge.target) {
      this.adjacencyList.get(edge.target)!.push({
        target: edge.source,
        weight,
        edgeId,
      });
    }

    return newEdge;
  }

  /**
   * Remove an edge by ID or by source and target
   */
  public removeEdge(edgeIdOrSource: string, target?: string): boolean {
    if (target !== undefined) {
      // Find edge by source and target
      let foundEdgeId: string | null = null;
      for (const [id, e] of this.edges.entries()) {
        if (
          (e.source === edgeIdOrSource && e.target === target) ||
          (!this.isDirected && e.source === target && e.target === edgeIdOrSource)
        ) {
          foundEdgeId = id;
          break;
        }
      }
      if (foundEdgeId) {
        this.edges.delete(foundEdgeId);
        this.rebuildAdjacencyList();
        return true;
      }
      return false;
    }

    // Remove by edge ID directly
    if (this.edges.has(edgeIdOrSource)) {
      this.edges.delete(edgeIdOrSource);
      this.rebuildAdjacencyList();
      return true;
    }

    return false;
  }

  /**
   * Update weight of an existing edge
   */
  public updateEdgeWeight(edgeId: string, newWeight: number): boolean {
    const edge = this.edges.get(edgeId);
    if (!edge) return false;

    edge.weight = newWeight;
    this.rebuildAdjacencyList();
    return true;
  }

  private rebuildAdjacencyList(): void {
    for (const vId of this.vertices.keys()) {
      this.adjacencyList.set(vId, []);
    }

    for (const edge of this.edges.values()) {
      if (this.adjacencyList.has(edge.source)) {
        this.adjacencyList.get(edge.source)!.push({
          target: edge.target,
          weight: edge.weight,
          edgeId: edge.id,
        });
      }

      if (!this.isDirected && edge.source !== edge.target && this.adjacencyList.has(edge.target)) {
        this.adjacencyList.get(edge.target)!.push({
          target: edge.source,
          weight: edge.weight,
          edgeId: edge.id,
        });
      }
    }
  }

  public getVertex(id: string): GraphVertex | undefined {
    return this.vertices.get(id);
  }

  public getAllVertices(): GraphVertex[] {
    return Array.from(this.vertices.values());
  }

  public getAllEdges(): GraphEdge[] {
    return Array.from(this.edges.values());
  }

  public getNeighbors(vertexId: string): AdjacencyListEdge[] {
    return this.adjacencyList.get(vertexId) || [];
  }

  public getInDegree(vertexId: string): number {
    let count = 0;
    for (const edge of this.edges.values()) {
      if (edge.target === vertexId) count++;
      if (!this.isDirected && edge.source === vertexId && edge.source !== edge.target) count++;
    }
    return count;
  }

  public getOutDegree(vertexId: string): number {
    return (this.adjacencyList.get(vertexId) || []).length;
  }

  /**
   * Compute Adjacency Matrix representation
   */
  public getAdjacencyMatrix(): {
    vertexOrder: string[];
    matrix: (number | null)[][];
  } {
    const vertexOrder = Array.from(this.vertices.keys()).sort();
    const indexMap = new Map<string, number>();
    vertexOrder.forEach((id, idx) => indexMap.set(id, idx));

    const n = vertexOrder.length;
    const matrix: (number | null)[][] = Array.from({ length: n }, () => Array(n).fill(null));

    // Diagonal is 0 for distance, but in raw connection matrix null if no self loop
    for (let i = 0; i < n; i++) {
      matrix[i][i] = 0;
    }

    for (const edge of this.edges.values()) {
      const u = indexMap.get(edge.source);
      const v = indexMap.get(edge.target);
      if (u !== undefined && v !== undefined) {
        matrix[u][v] = edge.weight;
        if (!this.isDirected) {
          matrix[v][u] = edge.weight;
        }
      }
    }

    return { vertexOrder, matrix };
  }

  /**
   * Compute Adjacency List representation formatted as a clean map
   */
  public getAdjacencyListMap(): Record<string, { target: string; weight: number; edgeId: string }[]> {
    const result: Record<string, { target: string; weight: number; edgeId: string }[]> = {};
    for (const [id, list] of this.adjacencyList.entries()) {
      result[id] = [...list];
    }
    return result;
  }

  public toGraphData(): GraphData {
    return {
      vertices: this.getAllVertices(),
      edges: this.getAllEdges(),
      isDirected: this.isDirected,
      isWeighted: this.isWeighted,
    };
  }

  public clone(): Graph {
    const newG = new Graph(this.isDirected, this.isWeighted);
    for (const v of this.vertices.values()) {
      newG.addVertex({ ...v });
    }
    for (const e of this.edges.values()) {
      newG.addEdge({ ...e });
    }
    return newG;
  }

  /**
   * Construct the mandatory sample network meeting section 7 requirements:
   * At least 12 vertices.
   * Multiple routers and switches.
   * Weighted communication links.
   * A disconnected group for connectivity testing.
   */
  public static createSampleNetwork(): Graph {
    const net = new Graph(false, true);

    // 12+ Vertices representing enterprise topology
    const devices: GraphVertex[] = [
      { id: 'R-Core', label: 'Core Backbone Router', type: 'router', ip: '10.0.0.1', x: 400, y: 100 },
      { id: 'R-East', label: 'East Edge Router', type: 'router', ip: '10.0.1.1', x: 200, y: 220 },
      { id: 'R-West', label: 'West Edge Router', type: 'router', ip: '10.0.2.1', x: 600, y: 220 },
      { id: 'SW-Dist-1', label: 'Dist Switch 1', type: 'switch', ip: '10.1.0.1', x: 120, y: 350 },
      { id: 'SW-Dist-2', label: 'Dist Switch 2', type: 'switch', ip: '10.1.0.2', x: 280, y: 350 },
      { id: 'SW-Dist-3', label: 'Dist Switch 3', type: 'switch', ip: '10.2.0.1', x: 520, y: 350 },
      { id: 'SW-Dist-4', label: 'Dist Switch 4', type: 'switch', ip: '10.2.0.2', x: 680, y: 350 },
      { id: 'SRV-Web', label: 'Main Web Server', type: 'server', ip: '10.1.1.10', x: 100, y: 480 },
      { id: 'SRV-DB', label: 'Primary DB Cluster', type: 'server', ip: '10.1.1.20', x: 260, y: 480 },
      { id: 'SRV-Auth', label: 'LDAP Auth Server', type: 'server', ip: '10.2.1.10', x: 540, y: 480 },
      { id: 'FW-Border', label: 'Perimeter Firewall', type: 'firewall', ip: '10.0.0.254', x: 400, y: 250 },
      { id: 'GW-Cloud', label: 'Cloud Hybrid Gateway', type: 'gateway', ip: '10.99.0.1', x: 400, y: 400 },

      // Disconnected Air-Gapped Subsystem (for disconnected graph testing)
      { id: 'R-Airgap', label: 'Air-Gapped Secure Router', type: 'router', ip: '192.168.99.1', x: 850, y: 150 },
      { id: 'SRV-Vault', label: 'Hardware Key Vault', type: 'server', ip: '192.168.99.10', x: 850, y: 300 },
    ];

    for (const dev of devices) {
      net.addVertex(dev);
    }

    // Weighted links (latency / cost in ms)
    const links: Omit<GraphEdge, 'id'>[] = [
      { source: 'R-Core', target: 'R-East', weight: 4, latencyMs: 4, bandwidthMbps: 10000 },
      { source: 'R-Core', target: 'R-West', weight: 3, latencyMs: 3, bandwidthMbps: 10000 },
      { source: 'R-Core', target: 'FW-Border', weight: 1, latencyMs: 1, bandwidthMbps: 10000 },
      { source: 'R-East', target: 'SW-Dist-1', weight: 2, latencyMs: 2, bandwidthMbps: 1000 },
      { source: 'R-East', target: 'SW-Dist-2', weight: 5, latencyMs: 5, bandwidthMbps: 1000 },
      { source: 'R-West', target: 'SW-Dist-3', weight: 3, latencyMs: 3, bandwidthMbps: 1000 },
      { source: 'R-West', target: 'SW-Dist-4', weight: 6, latencyMs: 6, bandwidthMbps: 1000 },
      { source: 'FW-Border', target: 'GW-Cloud', weight: 2, latencyMs: 2, bandwidthMbps: 5000 },
      { source: 'SW-Dist-1', target: 'SRV-Web', weight: 1, latencyMs: 1, bandwidthMbps: 1000 },
      { source: 'SW-Dist-2', target: 'SRV-DB', weight: 1, latencyMs: 1, bandwidthMbps: 1000 },
      { source: 'SW-Dist-3', target: 'SRV-Auth', weight: 2, latencyMs: 2, bandwidthMbps: 1000 },
      { source: 'SW-Dist-1', target: 'SW-Dist-2', weight: 2, latencyMs: 2, bandwidthMbps: 1000 },
      { source: 'SW-Dist-3', target: 'SW-Dist-4', weight: 2, latencyMs: 2, bandwidthMbps: 1000 },
      { source: 'GW-Cloud', target: 'SW-Dist-2', weight: 4, latencyMs: 4, bandwidthMbps: 2500 },
      { source: 'GW-Cloud', target: 'SW-Dist-3', weight: 4, latencyMs: 4, bandwidthMbps: 2500 },

      // Disconnected component link
      { source: 'R-Airgap', target: 'SRV-Vault', weight: 1, latencyMs: 1, bandwidthMbps: 1000 },
    ];

    for (const link of links) {
      net.addEdge(link);
    }

    return net;
  }

  /**
   * Sample Directed Acyclic Graph (DAG) for topological sort
   */
  public static createSampleDAG(): Graph {
    const dag = new Graph(true, true);
    ['DNS', 'DHCP', 'Gateway', 'Firewall', 'Proxy', 'WebServer', 'AppServer', 'Database'].forEach((v) => {
      dag.addVertex({ id: v, label: v });
    });

    dag.addEdge({ source: 'DHCP', target: 'Gateway', weight: 1 });
    dag.addEdge({ source: 'DNS', target: 'Gateway', weight: 1 });
    dag.addEdge({ source: 'Gateway', target: 'Firewall', weight: 1 });
    dag.addEdge({ source: 'Firewall', target: 'Proxy', weight: 1 });
    dag.addEdge({ source: 'Proxy', target: 'WebServer', weight: 1 });
    dag.addEdge({ source: 'WebServer', target: 'AppServer', weight: 1 });
    dag.addEdge({ source: 'AppServer', target: 'Database', weight: 1 });

    return dag;
  }

  /**
   * Sample Directed Cyclic Graph for cycle detection
   */
  public static createSampleCyclicGraph(): Graph {
    const cg = new Graph(true, true);
    ['RouterA', 'RouterB', 'RouterC', 'HostD'].forEach((v) => {
      cg.addVertex({ id: v, label: v });
    });

    cg.addEdge({ source: 'RouterA', target: 'RouterB', weight: 1 });
    cg.addEdge({ source: 'RouterB', target: 'RouterC', weight: 1 });
    cg.addEdge({ source: 'RouterC', target: 'RouterA', weight: 1 }); // Directed Cycle
    cg.addEdge({ source: 'RouterC', target: 'HostD', weight: 1 });

    return cg;
  }
}
