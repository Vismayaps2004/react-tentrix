import { useMemo } from "react";
import type { Shape } from "../../types/index.ts";

const CELL_SIZE = 20;
const CELL_GAP = 2;
const GRADIENT = "linear-gradient(145deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 55%)";

interface ShapePreviewProps {
  shape: Shape;
  onDragStart?: (grabOffset: [number, number]) => void;
}

export default function ShapePreview({ shape, onDragStart }: ShapePreviewProps) {
  const filled = useMemo(
    () => new Set(shape.cells.map(([r, c]) => `${r},${c}`)),
    [shape],
  );

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
          const isDraggable = isFilled && !!onDragStart;
          return (
            <div
              key={`${r},${c}`}
              className={isFilled
                ? `tentrix-piece${isDraggable ? " tentrix-piece-draggable" : ""}`
                : undefined}
              onPointerDown={isDraggable
                ? (e) => {
                  e.preventDefault();
                  onDragStart([r, c]);
                }
                : undefined}
              style={{
                background: isFilled
                  ? `${GRADIENT}, ${shape.color}`
                  : "transparent",
                cursor: isDraggable ? "grab" : "default",
                touchAction: "none",
              }}
            />
          );
        })
      )}
    </div>
  );
}
