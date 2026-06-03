import type { BoardState } from "../../types/index.ts";
import type { PreviewCell } from "../../hooks/useDragDrop.ts";
import Cell from "./Cell.tsx";

const BOARD_BG = "#16162A";
const GRID_GAP = 3;
const GRID_PADDING = 4;

interface BoardProps {
  board: BoardState;
  previewCells?: Map<string, PreviewCell>;
  containerRef?: (el: HTMLDivElement | null) => void;
}

export default function Board({ board, previewCells, containerRef }: BoardProps) {
  return (
    <div
      ref={containerRef ?? null}
      className="tentrix-board"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        gridTemplateRows: "repeat(10, 1fr)",
        aspectRatio: "1 / 1",
        gap: GRID_GAP,
        padding: GRID_PADDING,
        background: BOARD_BG,
        borderRadius: 12,
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {board.flatMap((row, r) =>
        row.map((color, c) => {
          const preview = previewCells?.get(`${r},${c}`);
          return (
            <Cell
              key={`${r},${c}`}
              color={preview?.color ?? color}
              previewState={preview ? (preview.valid ? "valid" : "invalid") : null}
            />
          );
        })
      )}
    </div>
  );
}
