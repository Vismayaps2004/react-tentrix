import type { ShapeSlot } from "../../types/index.ts";
import ShapePreview from "./ShapePreview.tsx";

const SLOT_SIZE = 120;

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
        padding: "16px 0",
      }}
    >
      {shapes.map((shape, i) => (
        <div
          key={i}
          style={{
            width: SLOT_SIZE,
            height: SLOT_SIZE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: shape ? (activeDragIndex === i ? 0.3 : 1) : 0.2,
            transition: "opacity 120ms",
          }}
        >
          {shape && (
            <ShapePreview
              shape={shape}
              index={i}
              onDragStart={onDragStart
                ? (grabOffset) => onDragStart(i, grabOffset)
                : undefined}
            />
          )}
        </div>
      ))}
    </div>
  );
}
