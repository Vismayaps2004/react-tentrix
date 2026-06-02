import { assert, assertEquals } from "@std/assert";
import { createInitialState, gameReducer } from "./gameEngine.ts";
import { createEmptyBoard, placeShape } from "./board.ts";
import { SHAPES } from "./shapes.ts";
import type { GameState, ShapeSlot } from "../types/index.ts";

const get = (id: string) => SHAPES.find((s) => s.id === id)!;
type Slots = [ShapeSlot, ShapeSlot, ShapeSlot];

// ─── Initial state ────────────────────────────────────────────────────────────

Deno.test("createInitialState: starts on playing screen with 3 shapes and zero score", () => {
  const state = createInitialState();
  assertEquals(state.screen, "playing");
  assertEquals(state.score, 0);
  assertEquals(state.shapes.length, 3);
  assert(state.shapes.every((s) => s !== null));
});

// ─── Score calculation ────────────────────────────────────────────────────────

Deno.test("score: increments by the placed shape's cell count (s1 = 1)", () => {
  const s1 = get("s1");
  const state = {
    screen: "playing" as const,
    board: createEmptyBoard(),
    shapes: [s1, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  assertEquals(next.score, 1);
});

Deno.test("score: increments by the placed shape's cell count (h5 = 5)", () => {
  const h5 = get("h5");
  const state = {
    screen: "playing" as const,
    board: createEmptyBoard(),
    shapes: [h5, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  assertEquals(next.score, h5.cells.length); // 5
});

Deno.test("score: accumulates correctly across sequential placements", () => {
  const s1 = get("s1");  // 1 cell
  const h3 = get("h3");  // 3 cells
  const sq2 = get("sq2"); // 4 cells
  let state: GameState = {
    screen: "playing" as const,
    board: createEmptyBoard(),
    shapes: [s1, h3, sq2] as Slots,
    score: 0,
    dragState: null,
  };
  state = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  state = gameReducer(state, { type: "PLACE", shapeIndex: 1, anchorRow: 2, anchorCol: 0 });
  state = gameReducer(state, { type: "PLACE", shapeIndex: 2, anchorRow: 5, anchorCol: 0 });
  assertEquals(state.score, 1 + 3 + 4); // 8
});

Deno.test("score: unchanged when placement is invalid", () => {
  const s1 = get("s1");
  const board = placeShape(createEmptyBoard(), s1, 0, 0);
  const state = {
    screen: "playing" as const,
    board,
    shapes: [s1, null, null] as Slots,
    score: 99,
    dragState: null,
  };
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  assertEquals(next.score, 99);
});

// ─── Shape slot management ────────────────────────────────────────────────────

Deno.test("slot: only the placed slot becomes null; others are untouched", () => {
  const s1 = get("s1");
  const h3 = get("h3");
  const state = {
    screen: "playing" as const,
    board: createEmptyBoard(),
    shapes: [s1, h3, null] as Slots,
    score: 0,
    dragState: null,
  };
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  assertEquals(next.shapes[0], null);
  assertEquals(next.shapes[1], h3); // unchanged
  assertEquals(next.shapes[2], null); // was already null
});

// ─── Tray refill ──────────────────────────────────────────────────────────────

Deno.test("refill: tray does NOT refill after 1 of 3 shapes placed", () => {
  const s1 = get("s1");
  const state = {
    screen: "playing" as const,
    board: createEmptyBoard(),
    shapes: [s1, s1, s1] as Slots,
    score: 0,
    dragState: null,
  };
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  assertEquals(next.shapes[0], null);
  assert(next.shapes[1] !== null); // not replaced
  assert(next.shapes[2] !== null); // not replaced
});

Deno.test("refill: tray does NOT refill after 2 of 3 shapes placed", () => {
  const s1 = get("s1");
  let state: GameState = {
    screen: "playing" as const,
    board: createEmptyBoard(),
    shapes: [s1, s1, s1] as Slots,
    score: 0,
    dragState: null,
  };
  state = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  state = gameReducer(state, { type: "PLACE", shapeIndex: 1, anchorRow: 2, anchorCol: 0 });
  assertEquals(state.shapes[0], null);
  assertEquals(state.shapes[1], null);
  assert(state.shapes[2] !== null); // still the original shape
});

Deno.test("refill: tray refills with 3 non-null shapes when all 3 are consumed", () => {
  const s1 = get("s1");
  let state: GameState = {
    screen: "playing" as const,
    board: createEmptyBoard(),
    shapes: [s1, s1, s1] as Slots,
    score: 0,
    dragState: null,
  };
  state = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  state = gameReducer(state, { type: "PLACE", shapeIndex: 1, anchorRow: 2, anchorCol: 0 });
  state = gameReducer(state, { type: "PLACE", shapeIndex: 2, anchorRow: 4, anchorCol: 0 });
  assert(state.shapes[0] !== null, "slot 0 should be refilled");
  assert(state.shapes[1] !== null, "slot 1 should be refilled");
  assert(state.shapes[2] !== null, "slot 2 should be refilled");
});

Deno.test("refill: refilled shapes are valid entries from the SHAPES catalogue", () => {
  const s1 = get("s1");
  const validIds = new Set(SHAPES.map((s) => s.id));
  let state: GameState = {
    screen: "playing" as const,
    board: createEmptyBoard(),
    shapes: [s1, s1, s1] as Slots,
    score: 0,
    dragState: null,
  };
  state = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  state = gameReducer(state, { type: "PLACE", shapeIndex: 1, anchorRow: 2, anchorCol: 0 });
  state = gameReducer(state, { type: "PLACE", shapeIndex: 2, anchorRow: 4, anchorCol: 0 });
  for (const shape of state.shapes) {
    assert(shape !== null && validIds.has(shape.id), `Unknown shape id: ${shape?.id}`);
  }
});

Deno.test("refill: score is preserved across a tray refill", () => {
  const s1 = get("s1");
  let state: GameState = {
    screen: "playing" as const,
    board: createEmptyBoard(),
    shapes: [s1, s1, s1] as Slots,
    score: 0,
    dragState: null,
  };
  state = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  state = gameReducer(state, { type: "PLACE", shapeIndex: 1, anchorRow: 2, anchorCol: 0 });
  state = gameReducer(state, { type: "PLACE", shapeIndex: 2, anchorRow: 4, anchorCol: 0 });
  assertEquals(state.score, 3); // 3 × s1 (1 cell each), refill does not reset score
});

// ─── Line clearing ────────────────────────────────────────────────────────────

Deno.test("clearing: completes and clears a row through the reducer", () => {
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
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 9 });
  for (let c = 0; c < 10; c++) assertEquals(next.board[0][c], null);
});

Deno.test("clearing: completes and clears a column through the reducer", () => {
  const s1 = get("s1");
  let board = createEmptyBoard();
  for (let r = 0; r < 9; r++) board = placeShape(board, s1, r, 5);
  const state = {
    screen: "playing" as const,
    board,
    shapes: [s1, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 9, anchorCol: 5 });
  for (let r = 0; r < 10; r++) assertEquals(next.board[r][5], null);
});

Deno.test("clearing: clears row and column simultaneously through reducer", () => {
  const s1 = get("s1");
  let board = createEmptyBoard();
  // Fill row 0 cols 1-9 and col 0 rows 1-9; place a marker at (1,1) to test non-cleared cell
  for (let c = 1; c < 10; c++) board = placeShape(board, s1, 0, c);
  for (let r = 1; r < 10; r++) board = placeShape(board, s1, r, 0);
  board = placeShape(board, s1, 1, 1); // not in row 0 or col 0
  const state = {
    screen: "playing" as const,
    board,
    shapes: [s1, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  // Placing at (0,0) completes row 0 and col 0
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  for (let c = 0; c < 10; c++) assertEquals(next.board[0][c], null, `row 0 col ${c}`);
  for (let r = 0; r < 10; r++) assertEquals(next.board[r][0], null, `col 0 row ${r}`);
  assertEquals(next.board[1][1], s1.color); // untouched cell preserved
});

Deno.test("clearing: clears multiple rows simultaneously through reducer", () => {
  const s1 = get("s1");
  const v2 = get("v2"); // 2×1 vertical, cells [[0,0],[1,0]]
  let board = createEmptyBoard();
  // Fill rows 2 and 3, columns 0-8
  for (let c = 0; c < 9; c++) {
    board = placeShape(board, s1, 2, c);
    board = placeShape(board, s1, 3, c);
  }
  const state = {
    screen: "playing" as const,
    board,
    shapes: [v2, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  // v2 at (2,9) fills (2,9) and (3,9) — completes both rows 2 and 3
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 2, anchorCol: 9 });
  for (let c = 0; c < 10; c++) assertEquals(next.board[2][c], null, `row 2 col ${c}`);
  for (let c = 0; c < 10; c++) assertEquals(next.board[3][c], null, `row 3 col ${c}`);
  assertEquals(next.score, v2.cells.length); // 2
});

// ─── No-op cases ──────────────────────────────────────────────────────────────

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
  const h3 = get("h3");
  const state = {
    screen: "playing" as const,
    board: createEmptyBoard(),
    shapes: [h3, null, null] as Slots,
    score: 0,
    dragState: null,
  };
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
