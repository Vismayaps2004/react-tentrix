import type { GameState } from "../types/index.ts";
import { createEmptyBoard } from "./board.ts";

export function createInitialState(): GameState {
  return {
    screen: "landing",
    board: createEmptyBoard(),
    shapes: [null, null, null],
    score: 0,
    dragState: null,
  };
}

export function startGame(state: GameState): GameState {
  return {
    ...state,
    screen: "playing",
    board: createEmptyBoard(),
    shapes: [null, null, null],
    score: 0,
    dragState: null,
  };
}

export function togglePause(state: GameState): GameState {
  return {
    ...state,
    screen: state.screen === "playing" ? "paused" : "playing",
  };
}
