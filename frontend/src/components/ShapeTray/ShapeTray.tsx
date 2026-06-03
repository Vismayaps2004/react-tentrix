import type { ShapeSlot } from "../../types/index.ts";
import ShapePreview from "./ShapePreview.tsx";

const SLOT_SIZE = 116;

interface ShapeTrayProps {
  shapes: [ShapeSlot, ShapeSlot, ShapeSlot];
  activeDragIndex?: number | null;
  onDragStart?: (shapeIndex: number, grabOffset: [number, number]) => void;
}

export default function ShapeTray(
  { shapes, activeDragIndex, onDragStart }: ShapeTrayProps,
) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "14px 0",
      }}
    >
      {shapes.map((shape, i) => {
        const isActive = activeDragIndex === i;
        return (
          <div
            key={i}
            style={{
              width: SLOT_SIZE,
              height: SLOT_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: shape ? (isActive ? 0.35 : 1) : 0.18,
              transform: isActive ? "scale(0.88)" : "scale(1)",
              filter: isActive ? "saturate(0.4)" : "none",
              transition: "opacity 160ms ease, transform 160ms ease, filter 160ms ease",
            }}
          >
            {shape && (
              <ShapePreview
                shape={shape}
                onDragStart={onDragStart
                  ? (grabOffset) => onDragStart(i, grabOffset)
                  : undefined}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
