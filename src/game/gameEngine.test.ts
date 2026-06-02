import { assert, assertEquals } from "@std/assert";
import { createInitialState, gameReducer } from "./gameEngine.ts";
import { createEmptyBoard, placeShape } from "./board.ts";
import { SHAPES } from "./shapes.ts";
import type { ShapeSlot } from "../types/index.ts";

const get = (id: string) => SHAPES.find((s) => s.id === id)!;
type Slots = [ShapeSlot, ShapeSlot, ShapeSlot];

Deno.test("createInitialState: starts on playing screen with 3 shapes and zero score", () => {
  const state = createInitialState();
  assertEquals(state.screen, "playing");
  assertEquals(state.score, 0);
  assertEquals(state.shapes.length, 3);
  assert(state.shapes.some((s) => s !== null));
});

Deno.test("gameReducer PLACE: places shape, clears slot, increments score by cell count", () => {
  const s1 = get("s1"); // 1 cell
  const h3 = get("h3"); // 3 cells
  const state = {
    screen: "playing" as const,
    board: createEmptyBoard(),
    shapes: [s1, h3, null] as Slots,
    score: 10,
    dragState: null,
  };

  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  assertEquals(next.shapes[0], null);
  assertEquals(next.score, 10 + s1.cells.length);
  assertEquals(next.board[0][0], s1.color);
  assertEquals(next.shapes[1], h3);
});

Deno.test("gameReducer PLACE: returns same state for a null slot", () => {
  const state = {
    screen: "playing" as const,
    board: createEmptyBoard(),
    shapes: [null, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  assertEquals(next, state);
});

Deno.test("gameReducer PLACE: returns same state for out-of-bounds placement", () => {
  const h3 = get("h3"); // 1×3, needs 3 columns
  const state = {
    screen: "playing" as const,
    board: createEmptyBoard(),
    shapes: [h3, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  // Anchor at col 9 → h3 would occupy cols 9,10,11 — invalid
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 9 });
  assertEquals(next, state);
});

Deno.test("gameReducer PLACE: returns same state when target cells are occupied", () => {
  const s1 = get("s1");
  const board = placeShape(createEmptyBoard(), s1, 0, 0);
  const state = {
    screen: "playing" as const,
    board,
    shapes: [s1, null, null] as Slots,
    score: 5,
    dragState: null,
  };
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  assertEquals(next, state);
});

Deno.test("gameReducer PLACE: clears completed rows after placement", () => {
  const s1 = get("s1");
  let board = createEmptyBoard();
  for (let c = 0; c < 9; c++) board = placeShape(board, s1, 0, c);
  const state = {
    screen: "playing" as const,
    board,
    shapes: [s1, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  // Placing at (0,9) completes row 0
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 9 });
  for (let c = 0; c < 10; c++) assertEquals(next.board[0][c], null);
});
