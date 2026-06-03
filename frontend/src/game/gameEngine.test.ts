import { assert, assertEquals } from "@std/assert";
import { createInitialState, gameReducer } from "./gameEngine.ts";
import { BOARD_SIZE, createEmptyBoard, placeShape } from "./board.ts";
import { SHAPES } from "./shapes.ts";
import type { BoardState, GameState, ShapeSlot } from "../types/index.ts";

const get = (id: string) => SHAPES.find((s) => s.id === id)!;
type Slots = [ShapeSlot, ShapeSlot, ShapeSlot];

// Checkerboard board: null where (r+c) is even, "#block" where odd.
// No row or column is ever complete (each has 5 nulls and 5 filled).
// sq3 (3×3) cannot fit anywhere — every 3×3 area contains at least one "#block".
// s1 (1×1) can fit at any even-sum cell, e.g. (0,0).
const checkerBoard = (): BoardState =>
  Array.from({ length: BOARD_SIZE }, (_, r) =>
    Array.from({ length: BOARD_SIZE }, (_, c) => ((r + c) % 2 === 0 ? null : "#block"))
  );

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

Deno.test("score: adds +10 for each cleared row", () => {
  const s1 = get("s1");
  let board = createEmptyBoard();
  for (let c = 0; c < 9; c++) board = placeShape(board, s1, 0, c);
  const state: GameState = {
    screen: "playing",
    board,
    shapes: [s1, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  // Placing at (0,9) completes row 0
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 9 });
  assertEquals(next.score, s1.cells.length + 10); // 1 cell + 1 row × 10
});

Deno.test("score: adds +10 for each cleared column", () => {
  const s1 = get("s1");
  let board = createEmptyBoard();
  for (let r = 0; r < 9; r++) board = placeShape(board, s1, r, 3);
  const state: GameState = {
    screen: "playing",
    board,
    shapes: [s1, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  // Placing at (9,3) completes column 3
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 9, anchorCol: 3 });
  assertEquals(next.score, s1.cells.length + 10); // 1 cell + 1 col × 10
});

Deno.test("score: adds +10 per line for simultaneous row and column clear", () => {
  const s1 = get("s1");
  let board = createEmptyBoard();
  for (let c = 1; c < 10; c++) board = placeShape(board, s1, 0, c);
  for (let r = 1; r < 10; r++) board = placeShape(board, s1, r, 0);
  const state: GameState = {
    screen: "playing",
    board,
    shapes: [s1, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  // Placing at (0,0) completes row 0 and col 0 simultaneously
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  assertEquals(next.score, s1.cells.length + 20); // 1 cell + (1 row + 1 col) × 10
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
  assertEquals(next.score, v2.cells.length + 20); // 2 cells + 2 rows × 10
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

Deno.test("gameReducer PLACE: ignored when screen is not playing", () => {
  const s1 = get("s1");
  const state: GameState = {
    screen: "gameover",
    board: createEmptyBoard(),
    shapes: [s1, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  assertEquals(next, state);
});

// ─── Game-over detection ──────────────────────────────────────────────────────

Deno.test("game-over: screen stays 'playing' when remaining shapes can still be placed", () => {
  const s1 = get("s1");
  const state: GameState = {
    screen: "playing",
    board: createEmptyBoard(),
    shapes: [s1, s1, s1] as Slots,
    score: 0,
    dragState: null,
  };
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  assertEquals(next.screen, "playing");
});

Deno.test("game-over: screen becomes 'gameover' when no remaining shape can be placed", () => {
  // checkerboard: s1 fits at (0,0); sq3 (3×3) cannot fit anywhere (no 3×3 all-null area)
  // After placing s1, only sq3 remains → game over
  const s1 = get("s1");
  const sq3 = get("sq3");
  const state: GameState = {
    screen: "playing",
    board: checkerBoard(),
    shapes: [s1, sq3, null] as Slots,
    score: 0,
    dragState: null,
  };
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  assertEquals(next.screen, "gameover");
});

Deno.test("game-over: final score is preserved on gameover transition", () => {
  const s1 = get("s1");
  const sq3 = get("sq3");
  const state: GameState = {
    screen: "playing",
    board: checkerBoard(),
    shapes: [s1, sq3, null] as Slots,
    score: 42,
    dragState: null,
  };
  const next = gameReducer(state, { type: "PLACE", shapeIndex: 0, anchorRow: 0, anchorCol: 0 });
  assertEquals(next.screen, "gameover");
  assertEquals(next.score, 42 + s1.cells.length);
});

// ─── Restart ──────────────────────────────────────────────────────────────────

Deno.test("RESTART: resets board to empty", () => {
  const filledBoard: BoardState = Array.from(
    { length: BOARD_SIZE },
    () => Array(BOARD_SIZE).fill("#block"),
  );
  const state: GameState = {
    screen: "gameover",
    board: filledBoard,
    shapes: [null, null, null] as Slots,
    score: 999,
    dragState: null,
  };
  const next = gameReducer(state, { type: "RESTART" });
  assert(next.board.every((row) => row.every((cell) => cell === null)));
});

Deno.test("RESTART: resets score to zero", () => {
  const state: GameState = {
    screen: "gameover",
    board: createEmptyBoard(),
    shapes: [null, null, null] as Slots,
    score: 500,
    dragState: null,
  };
  assertEquals(gameReducer(state, { type: "RESTART" }).score, 0);
});

Deno.test("RESTART: screen returns to playing", () => {
  const state: GameState = {
    screen: "gameover",
    board: createEmptyBoard(),
    shapes: [null, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  assertEquals(gameReducer(state, { type: "RESTART" }).screen, "playing");
});

Deno.test("RESTART: generates 3 non-null shapes", () => {
  const state: GameState = {
    screen: "gameover",
    board: createEmptyBoard(),
    shapes: [null, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  const next = gameReducer(state, { type: "RESTART" });
  assert(next.shapes.every((s) => s !== null), "all 3 slots should be filled");
});

Deno.test("RESTART: new shapes are from the SHAPES catalogue", () => {
  const validIds = new Set(SHAPES.map((s) => s.id));
  const state: GameState = {
    screen: "gameover",
    board: createEmptyBoard(),
    shapes: [null, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  const next = gameReducer(state, { type: "RESTART" });
  for (const shape of next.shapes) {
    assert(shape !== null && validIds.has(shape.id));
  }
});

// ─── Pause / Resume ───────────────────────────────────────────────────────────

Deno.test("TOGGLE_PAUSE: playing → paused", () => {
  const state = createInitialState(); // screen: "playing"
  const next = gameReducer(state, { type: "TOGGLE_PAUSE" });
  assertEquals(next.screen, "paused");
});

Deno.test("TOGGLE_PAUSE: paused → playing (resume)", () => {
  const state: GameState = { ...createInitialState(), screen: "paused" };
  const next = gameReducer(state, { type: "TOGGLE_PAUSE" });
  assertEquals(next.screen, "playing");
});

Deno.test("TOGGLE_PAUSE: no-op on gameover screen", () => {
  const base = createInitialState();
  const state: GameState = { ...base, screen: "gameover" };
  assertEquals(gameReducer(state, { type: "TOGGLE_PAUSE" }), state);
});

Deno.test("TOGGLE_PAUSE: board, score, and shapes preserved when pausing", () => {
  const s1 = get("s1");
  const state: GameState = {
    screen: "playing",
    board: createEmptyBoard(),
    shapes: [s1, null, null] as Slots,
    score: 42,
    dragState: null,
  };
  const next = gameReducer(state, { type: "TOGGLE_PAUSE" });
  assertEquals(next.screen, "paused");
  assertEquals(next.score, 42);
  assertEquals(next.shapes[0], s1);
  assertEquals(next.board, state.board); // same reference — nothing changed
});

Deno.test("TOGGLE_PAUSE: board, score, and shapes preserved when resuming", () => {
  const s1 = get("s1");
  const state: GameState = {
    screen: "paused",
    board: createEmptyBoard(),
    shapes: [s1, null, null] as Slots,
    score: 77,
    dragState: null,
  };
  const next = gameReducer(state, { type: "TOGGLE_PAUSE" });
  assertEquals(next.screen, "playing");
  assertEquals(next.score, 77);
  assertEquals(next.shapes[0], s1);
  assertEquals(next.board, state.board);
});

Deno.test("PLACE: blocked when screen is paused", () => {
  const s1 = get("s1");
  const state: GameState = {
    screen: "paused",
    board: createEmptyBoard(),
    shapes: [s1, null, null] as Slots,
    score: 0,
    dragState: null,
  };
  const next = gameReducer(state, {
    type: "PLACE",
    shapeIndex: 0,
    anchorRow: 0,
    anchorCol: 0,
  });
  assertEquals(next, state); // no change
});
