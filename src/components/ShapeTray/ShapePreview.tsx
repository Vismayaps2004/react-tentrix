import type { Shape } from "../../types/index.ts";

const CELL_SIZE = 20;
const CELL_GAP = 2;

interface ShapePreviewProps {
  shape: Shape;
  index: number;
  onDragStart?: (grabOffset: [number, number]) => void;
}

export default function ShapePreview(
  { shape, index: _, onDragStart }: ShapePreviewProps,
) {
  const filled = new Set(shape.cells.map(([r, c]) => `${r},${c}`));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${shape.cols}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${shape.rows}, ${CELL_SIZE}px)`,
        gap: CELL_GAP,
      }}
    >
      {Array.from({ length: shape.rows }, (_, r) =>
        Array.from({ length: shape.cols }, (_, c) => {
          const isFilled = filled.has(`${r},${c}`);
          return (
            <div
              key={`${r},${c}`}
              onPointerDown={isFilled && onDragStart
                ? (e) => {
                  e.preventDefault();
                  onDragStart([r, c]);
                }
                : undefined}
              style={{
                background: isFilled ? shape.color : "transparent",
                borderRadius: 3,
                cursor: isFilled ? "grab" : "default",
                touchAction: "none",
              }}
            />
          );
        })
      )}
    </div>
  );
}
