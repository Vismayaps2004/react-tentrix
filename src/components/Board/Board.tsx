import type { BoardState, DragState } from "../../types/index.ts";
import Cell from "./Cell.tsx";

const GRID_GAP = 2;
const GRID_PADDING = 2;
const BOARD_BG = "#2C2C3E";

interface BoardProps {
  board: BoardState;
  dragState: DragState | null;
}

export default function Board({ board, dragState: _ }: BoardProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        gridTemplateRows: "repeat(10, 1fr)",
        aspectRatio: "1",
        gap: GRID_GAP,
        padding: GRID_PADDING,
        background: BOARD_BG,
        borderRadius: 8,
      }}
    >
      {board.flatMap((row, r) =>
        row.map((color, c) => (
          <Cell key={`${r},${c}`} color={color} row={r} col={c} />
        ))
      )}
    </div>
  );
}
