import type { BoardState, Shape } from "../types/index.ts";

export const BOARD_SIZE = 10;

export function createEmptyBoard(): BoardState {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

export function canPlace(
  board: BoardState,
  shape: Shape,
  anchorRow: number,
  anchorCol: number,
): boolean {
  return shape.cells.every(([dr, dc]) => {
    const r = anchorRow + dr;
    const c = anchorCol + dc;
    return (
      r >= 0 && r < BOARD_SIZE &&
      c >= 0 && c < BOARD_SIZE &&
      board[r][c] === null
    );
  });
}

export function placeShape(
  board: BoardState,
  shape: Shape,
  anchorRow: number,
  anchorCol: number,
): BoardState {
  const next = board.map((row) => [...row]);
  for (const [dr, dc] of shape.cells) {
    next[anchorRow + dr][anchorCol + dc] = shape.color;
  }
  return next;
}

export function clearLines(
  board: BoardState,
): { board: BoardState; clearedRows: number; clearedCols: number } {
  const completedRows = new Set<number>();
  const completedCols = new Set<number>();

  for (let r = 0; r < BOARD_SIZE; r++) {
    if (board[r].every((cell) => cell !== null)) completedRows.add(r);
  }
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (board.every((row) => row[c] !== null)) completedCols.add(c);
  }

  if (completedRows.size === 0 && completedCols.size === 0) {
    return { board, clearedRows: 0, clearedCols: 0 };
  }

  const next = board.map((row, r) =>
    row.map((cell, c) =>
      completedRows.has(r) || completedCols.has(c) ? null : cell
    )
  );

  return { board: next, clearedRows: completedRows.size, clearedCols: completedCols.size };
}

function hasAnyValidPlacement(board: BoardState, shape: Shape): boolean {
  for (let r = 0; r <= BOARD_SIZE - shape.rows; r++) {
    for (let c = 0; c <= BOARD_SIZE - shape.cols; c++) {
      if (canPlace(board, shape, r, c)) return true;
    }
  }
  return false;
}

export function isGameOver(
  board: BoardState,
  shapes: (Shape | null)[],
): boolean {
  const active = shapes.filter((s): s is Shape => s !== null);
  if (active.length === 0) return false;
  return active.every((shape) => !hasAnyValidPlacement(board, shape));
}
