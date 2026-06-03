export type CellColor = string | null;
export type BoardState = CellColor[][];

export type ShapeCell = [number, number]; // [rowOffset, colOffset] from origin

export interface Shape {
  id: string;
  cells: ShapeCell[];
  color: string;
  rows: number; // bounding box height
  cols: number; // bounding box width
}

export type ShapeSlot = Shape | null;

export type Screen = "landing" | "playing" | "paused" | "gameover";

export interface DragState {
  shapeIndex: number;
  grabOffset: [number, number]; // which cell within the shape was grabbed
  hoverCell: [number, number] | null; // [row, col] on board under the pointer
}

export interface GameState {
  screen: Screen;
  board: BoardState;
  shapes: [ShapeSlot, ShapeSlot, ShapeSlot];
  score: number;
  dragState: DragState | null;
}
