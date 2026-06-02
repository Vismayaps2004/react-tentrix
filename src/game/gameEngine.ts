import type { GameState, ShapeSlot } from "../types/index.ts";
import { canPlace, placeShape, clearLines, createEmptyBoard } from "./board.ts";
import { getRandomShapes } from "./shapes.ts";

export type GameAction =
  | { type: "PLACE"; shapeIndex: number; anchorRow: number; anchorCol: number };

export function createInitialState(): GameState {
  const [a, b, c] = getRandomShapes(3);
  return {
    screen: "playing",
    board: createEmptyBoard(),
    shapes: [a ?? null, b ?? null, c ?? null],
    score: 0,
    dragState: null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "PLACE": {
      const { shapeIndex, anchorRow, anchorCol } = action;
      const shape = state.shapes[shapeIndex];
      if (!shape) return state;
      if (!canPlace(state.board, shape, anchorRow, anchorCol)) return state;

      const placed = placeShape(state.board, shape, anchorRow, anchorCol);
      const { board } = clearLines(placed);

      const newShapes = [...state.shapes] as [ShapeSlot, ShapeSlot, ShapeSlot];
      newShapes[shapeIndex] = null;

      return {
        ...state,
        board,
        shapes: newShapes,
        score: state.score + shape.cells.length,
      };
    }
    default:
      return state;
  }
}
