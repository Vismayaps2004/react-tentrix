import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BoardState, DragState, ShapeSlot } from "../types/index.ts";
import { BOARD_SIZE, canPlace } from "../game/board.ts";

export interface PreviewCell {
  color: string;
  valid: boolean;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const INVALID_COLOR = "rgba(248,113,113,0.55)"; // red-400 at 55%

export function useDragDrop(
  board: BoardState,
  shapes: [ShapeSlot, ShapeSlot, ShapeSlot],
  onPlace: (shapeIndex: number, anchorRow: number, anchorCol: number) => void,
  enabled: boolean = true,
) {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const boardEl = useRef<HTMLDivElement | null>(null);

  const snapshot = useRef({ dragState, shapes, board, onPlace });
  snapshot.current = { dragState, shapes, board, onPlace };

  useEffect(() => {
    if (!enabled) setDragState(null);
  }, [enabled]);

  useEffect(() => {
    if (!dragState) return;
    document.body.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = "";
    };
  }, [!!dragState]);

  useEffect(() => {
    if (!dragState) return;

    const cellAt = (x: number, y: number): [number, number] | null => {
      const el = boardEl.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const col = Math.floor(((x - rect.left) / rect.width) * BOARD_SIZE);
      const row = Math.floor(((y - rect.top) / rect.height) * BOARD_SIZE);
      return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
        ? [row, col]
        : null;
    };

    const onMove = (e: PointerEvent) => {
      const cell = cellAt(e.clientX, e.clientY);
      setDragState((prev) => (prev ? { ...prev, hoverCell: cell } : null));
    };

    const onUp = (e: PointerEvent) => {
      const { dragState: ds, shapes: s, board: b, onPlace: place } =
        snapshot.current;
      if (ds) {
        const cell = cellAt(e.clientX, e.clientY);
        if (cell) {
          const [row, col] = cell;
          const [dr, dc] = ds.grabOffset;
          const anchorRow = row - dr;
          const anchorCol = col - dc;
          const shape = s[ds.shapeIndex];
          if (shape && canPlace(b, shape, anchorRow, anchorCol)) {
            place(ds.shapeIndex, anchorRow, anchorCol);
          }
        }
      }
      setDragState(null);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, [!!dragState]);

  const startDrag = useCallback(
    (shapeIndex: number, grabOffset: [number, number]) => {
      if (!enabled) return;
      setDragState({ shapeIndex, grabOffset, hoverCell: null });
    },
    [enabled],
  );

  const setBoardRef = useCallback((el: HTMLDivElement | null) => {
    boardEl.current = el;
  }, []);

  // Structured preview: each entry carries its color and validity flag so
  // Board can apply the correct CSS class without inspecting the color string.
  const previewCells = useMemo((): Map<string, PreviewCell> => {
    const map = new Map<string, PreviewCell>();
    if (!dragState?.hoverCell) return map;

    const [row, col] = dragState.hoverCell;
    const [dr, dc] = dragState.grabOffset;
    const anchorRow = row - dr;
    const anchorCol = col - dc;
    const shape = shapes[dragState.shapeIndex];
    if (!shape) return map;

    const valid = canPlace(board, shape, anchorRow, anchorCol);
    const color = valid ? hexToRgba(shape.color, 0.72) : INVALID_COLOR;

    for (const [sr, sc] of shape.cells) {
      const r = anchorRow + sr;
      const c = anchorCol + sc;
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        map.set(`${r},${c}`, { color, valid });
      }
    }
    return map;
  }, [dragState, shapes, board]);

  return { dragState, previewCells, startDrag, setBoardRef };
}
