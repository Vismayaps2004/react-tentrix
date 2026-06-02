import type { BoardState, DragState } from "../../types/index.ts";
import Cell from "./Cell.tsx";

const GRID_GAP = 2;
const GRID_PADDING = 2;
const BOARD_BG = "#2C2C3E";

interface BoardProps {
  board: BoardState;
  dragState?: DragState | null;
  previewCells?: Map<string, string>;
  containerRef?: (el: HTMLDivElement | null) => void;
}

export default function Board(
  { board, previewCells, containerRef }: BoardProps,
) {
  return (
    <div
      ref={containerRef ?? null}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        gridTemplateRows: "repeat(10, 1fr)",
        aspectRatio: "1",
        gap: GRID_GAP,
        padding: GRID_PADDING,
        background: BOARD_BG,
        borderRadius: 8,
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {board.flatMap((row, r) =>
        row.map((color, c) => (
          <Cell
            key={`${r},${c}`}
            color={previewCells?.get(`${r},${c}`) ?? color}
            row={r}
            col={c}
          />
        ))
      )}
    </div>
  );
}
