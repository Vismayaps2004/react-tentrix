import type { GameState, ShapeSlot } from "../types/index.ts";
import {
  canPlace,
  clearLines,
  createEmptyBoard,
  isGameOver,
  placeShape,
} from "./board.ts";
import { getRandomShapes } from "./shapes.ts";

export type GameAction =
  | { type: "PLACE"; shapeIndex: number; anchorRow: number; anchorCol: number }
  | { type: "RESTART" }
  | { type: "TOGGLE_PAUSE" };

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
      if (state.screen !== "playing") return state;

      const { shapeIndex, anchorRow, anchorCol } = action;
      const shape = state.shapes[shapeIndex];
      if (!shape) return state;
      if (!canPlace(state.board, shape, anchorRow, anchorCol)) return state;

      const placed = placeShape(state.board, shape, anchorRow, anchorCol);
      const { board } = clearLines(placed);

      const newShapes = [...state.shapes] as [ShapeSlot, ShapeSlot, ShapeSlot];
      newShapes[shapeIndex] = null;

      if (newShapes.every((s) => s === null)) {
        const [a, b, c] = getRandomShapes(3);
        newShapes[0] = a ?? null;
        newShapes[1] = b ?? null;
        newShapes[2] = c ?? null;
      }

      const screen = isGameOver(board, newShapes) ? "gameover" : state.screen;

      return {
        ...state,
        screen,
        board,
        shapes: newShapes,
        score: state.score + shape.cells.length,
      };
    }
    case "RESTART":
      return createInitialState();
    case "TOGGLE_PAUSE":
      if (state.screen === "playing") return { ...state, screen: "paused" };
      if (state.screen === "paused") return { ...state, screen: "playing" };
      return state;
    default:
      return state;
  }
}
