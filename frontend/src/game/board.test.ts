import { assert, assertEquals } from "@std/assert";
import { BOARD_SIZE, canPlace, clearLines, createEmptyBoard, isGameOver, placeShape } from "./board.ts";
import { SHAPES } from "./shapes.ts";
import type { BoardState } from "../types/index.ts";

const get = (id: string) => SHAPES.find((s) => s.id === id)!;

Deno.test("createEmptyBoard: returns 10x10 grid of nulls", () => {
  const board = createEmptyBoard();
  assertEquals(board.length, BOARD_SIZE);
  for (const row of board) {
    assertEquals(row.length, BOARD_SIZE);
    for (const cell of row) assertEquals(cell, null);
  }
});

Deno.test("canPlace: single cell fits anywhere on empty board", () => {
  const board = createEmptyBoard();
  const s1 = get("s1");
  assert(canPlace(board, s1, 0, 0));
  assert(canPlace(board, s1, 9, 9));
  assert(canPlace(board, s1, 5, 5));
});

Deno.test("canPlace: rejects out-of-bounds placements", () => {
  const board = createEmptyBoard();
  const h3 = get("h3"); // 1x3, needs cols c, c+1, c+2
  assert(!canPlace(board, h3, 0, 8)); // col 10 out of bounds
  assert(!canPlace(board, h3, -1, 0)); // negative row
  assert(!canPlace(board, h3, 0, -1)); // negative col
  assert(!canPlace(board, get("v3"), 8, 0)); // row 10 out of bounds
});

Deno.test("canPlace: rejects placement on occupied cell", () => {
  const s1 = get("s1");
  const board = placeShape(createEmptyBoard(), s1, 4, 4);
  assert(!canPlace(board, s1, 4, 4));
});

Deno.test("canPlace: allows placement adjacent to occupied cell", () => {
  const s1 = get("s1");
  const board = placeShape(createEmptyBoard(), s1, 4, 4);
  assert(canPlace(board, s1, 4, 5));
  assert(canPlace(board, s1, 5, 4));
  assert(canPlace(board, s1, 3, 4));
});

Deno.test("placeShape: fills exactly the shape's cells with its color", () => {
  const h3 = get("h3"); // cells: [0,0],[0,1],[0,2]
  const board = placeShape(createEmptyBoard(), h3, 2, 4);
  assertEquals(board[2][4], h3.color);
  assertEquals(board[2][5], h3.color);
  assertEquals(board[2][6], h3.color);
  assertEquals(board[2][3], null); // left of shape
  assertEquals(board[2][7], null); // right of shape
  assertEquals(board[1][4], null); // row above
  assertEquals(board[3][4], null); // row below
});

Deno.test("placeShape: does not mutate the original board", () => {
  const board = createEmptyBoard();
  const s1 = get("s1");
  placeShape(board, s1, 0, 0);
  assertEquals(board[0][0], null);
});

Deno.test("clearLines: returns unchanged board when nothing is complete", () => {
  const board = placeShape(createEmptyBoard(), get("s1"), 0, 0);
  const result = clearLines(board);
  assertEquals(result.clearedRows, 0);
  assertEquals(result.clearedCols, 0);
  assertEquals(result.board[0][0], get("s1").color);
});

Deno.test("clearLines: clears a complete row", () => {
  const s1 = get("s1");
  let board = createEmptyBoard();
  for (let c = 0; c < BOARD_SIZE; c++) board = placeShape(board, s1, 5, c);
  const result = clearLines(board);
  assertEquals(result.clearedRows, 1);
  assertEquals(result.clearedCols, 0);
  for (let c = 0; c < BOARD_SIZE; c++) assertEquals(result.board[5][c], null);
});

Deno.test("clearLines: clears a complete column", () => {
  const s1 = get("s1");
  let board = createEmptyBoard();
  for (let r = 0; r < BOARD_SIZE; r++) board = placeShape(board, s1, r, 7);
  const result = clearLines(board);
  assertEquals(result.clearedRows, 0);
  assertEquals(result.clearedCols, 1);
  for (let r = 0; r < BOARD_SIZE; r++) assertEquals(result.board[r][7], null);
});

Deno.test("clearLines: clears row and column simultaneously without double-count error", () => {
  const s1 = get("s1");
  let board = createEmptyBoard();
  // Fill row 0 and column 0 (intersection at (0,0) is set once)
  for (let c = 0; c < BOARD_SIZE; c++) board = placeShape(board, s1, 0, c);
  for (let r = 1; r < BOARD_SIZE; r++) board = placeShape(board, s1, r, 0);
  const result = clearLines(board);
  assertEquals(result.clearedRows, 1);
  assertEquals(result.clearedCols, 1);
  for (let c = 0; c < BOARD_SIZE; c++) assertEquals(result.board[0][c], null);
  for (let r = 0; r < BOARD_SIZE; r++) assertEquals(result.board[r][0], null);
});

Deno.test("clearLines: does not clear non-completed rows", () => {
  const s1 = get("s1");
  let board = createEmptyBoard();
  for (let c = 0; c < BOARD_SIZE; c++) board = placeShape(board, s1, 5, c);
  // Row 3 is partially filled
  board = placeShape(board, s1, 3, 0);
  const result = clearLines(board);
  assertEquals(result.board[3][0], s1.color); // row 3 not cleared
});

// ─── isGameOver ───────────────────────────────────────────────────────────────

// Helper: board with all cells filled
const fullBoard = (): BoardState =>
  Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill("#block"));

// Helper: board where cols 0,3,6,9 are empty; cols 1,2,4,5,7,8 are filled.
// No row has 3 consecutive empty cells → h3 (1×3) can never fit.
const isolatedBoard = (): BoardState =>
  Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, (_, c) => (c % 3 === 0 ? null : "#block"))
  );

Deno.test("isGameOver: false on empty board (all shapes fit)", () => {
  const board = createEmptyBoard();
  assert(!isGameOver(board, [get("s1"), get("h3"), null]));
});

Deno.test("isGameOver: false when shapes array contains only nulls", () => {
  assert(!isGameOver(createEmptyBoard(), [null, null, null]));
});

Deno.test("isGameOver: false when shapes array is empty", () => {
  assert(!isGameOver(fullBoard(), []));
});

Deno.test("isGameOver: true when board is completely filled", () => {
  assert(isGameOver(fullBoard(), [get("s1")]));
});

Deno.test("isGameOver: false when s1 fits in the single remaining empty cell", () => {
  const board: BoardState = Array.from({ length: BOARD_SIZE }, (_, r) =>
    Array.from({ length: BOARD_SIZE }, (_, c) => (r === 5 && c === 5 ? null : "#block"))
  );
  assert(!isGameOver(board, [get("s1")]));
});

Deno.test("isGameOver: true when no row has 3 consecutive empty cells (h3)", () => {
  // isolated pattern: empty at 0,3,6,9; gaps between them are always < 3
  assert(isGameOver(isolatedBoard(), [get("h3")]));
});

Deno.test("isGameOver: false when at least one shape from tray can fit", () => {
  // s1 fits anywhere in the isolated pattern; h3 cannot
  assert(!isGameOver(isolatedBoard(), [get("s1"), get("h3"), null]));
});

Deno.test("isGameOver: true with null padding when the only active shape cannot fit", () => {
  // Same logic as previous test but with two null slots alongside h3
  assert(isGameOver(isolatedBoard(), [get("h3"), null, null]));
});
