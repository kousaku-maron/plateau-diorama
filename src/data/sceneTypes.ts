export interface SceneData {
  ground: GroundData;
  buildings: BuildingData[];
}

export interface GroundData {
  width: number;
  depth: number;
  color: string;
}

export interface BuildingData {
  /** X / Z on the Three.js ground plane. */
  position: [number, number];
  /** Width / Depth / Height. */
  size: [number, number, number];
  color?: string;
}
