import type { DragState } from "../types/index.ts";

export function useDragDrop() {
  return {
    dragState: null as DragState | null,
    onDragStart: (_shapeIndex: number) => {},
    onDragEnd: () => {},
    onCellHover: (_row: number, _col: number) => {},
  };
}
