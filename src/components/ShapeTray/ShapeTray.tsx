import type { ShapeSlot } from "../../types/index.ts";
import ShapePreview from "./ShapePreview.tsx";

const SLOT_SIZE = 120;

interface ShapeTrayProps {
  shapes: [ShapeSlot, ShapeSlot, ShapeSlot];
}

export default function ShapeTray({ shapes }: ShapeTrayProps) {
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
            opacity: shape ? 1 : 0.25,
          }}
        >
          {shape && <ShapePreview shape={shape} index={i} />}
        </div>
      ))}
    </div>
  );
}
