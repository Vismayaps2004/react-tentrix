import type { Shape } from "../../types/index.ts";

const CELL_SIZE = 20;
const CELL_GAP = 2;

interface ShapePreviewProps {
  shape: Shape;
  index: number;
}

export default function ShapePreview({ shape, index: _ }: ShapePreviewProps) {
  const filled = new Set(shape.cells.map(([r, c]) => `${r},${c}`));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${shape.cols}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${shape.rows}, ${CELL_SIZE}px)`,
        gap: `${CELL_GAP}px`,
      }}
    >
      {Array.from({ length: shape.rows }, (_, r) =>
        Array.from({ length: shape.cols }, (_, c) => (
          <div
            key={`${r},${c}`}
            style={{
              background: filled.has(`${r},${c}`) ? shape.color : "transparent",
              borderRadius: 3,
            }}
          />
        ))
      )}
    </div>
  );
}
