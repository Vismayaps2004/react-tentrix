import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BoardState, DragState, ShapeSlot } from "../types/index.ts";
import { BOARD_SIZE, canPlace } from "../game/board.ts";

export function useDragDrop(
  board: BoardState,
  shapes: [ShapeSlot, ShapeSlot, ShapeSlot],
  onPlace: (shapeIndex: number, anchorRow: number, anchorCol: number) => void,
) {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const boardEl = useRef<HTMLDivElement | null>(null);

  // Keep mutable snapshot so event handlers never close over stale values.
  const snapshot = useRef({ dragState, shapes, board, onPlace });
  snapshot.current = { dragState, shapes, board, onPlace };

  // Grab cursor on body while dragging.
  useEffect(() => {
    if (!dragState) return;
    document.body.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = "";
    };
  }, [!!dragState]);

  // Global pointer listeners — attached only while a drag is in progress.
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
  }, [!!dragState]); // re-attach only when dragging starts or stops

  const startDrag = useCallback(
    (shapeIndex: number, grabOffset: [number, number]) => {
      setDragState({ shapeIndex, grabOffset, hoverCell: null });
    },
    [],
  );

  // Callback ref so Board can register its DOM node.
  const setBoardRef = useCallback((el: HTMLDivElement | null) => {
    boardEl.current = el;
  }, []);

  // Preview cells: map from "r,c" → color to overlay on the board.
  const previewCells = useMemo((): Map<string, string> => {
    const map = new Map<string, string>();
    if (!dragState?.hoverCell) return map;

    const [row, col] = dragState.hoverCell;
    const [dr, dc] = dragState.grabOffset;
    const anchorRow = row - dr;
    const anchorCol = col - dc;
    const shape = shapes[dragState.shapeIndex];
    if (!shape) return map;

    const valid = canPlace(board, shape, anchorRow, anchorCol);
    const color = valid ? shape.color : "#EF5350";

    for (const [sr, sc] of shape.cells) {
      const r = anchorRow + sr;
      const c = anchorCol + sc;
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        map.set(`${r},${c}`, color);
      }
    }
    return map;
  }, [dragState, shapes, board]);

  return { dragState, previewCells, startDrag, setBoardRef };
}
