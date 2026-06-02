import { useState } from "react";
import type { BoardState, ShapeSlot } from "./types/index.ts";
import { createEmptyBoard } from "./game/board.ts";
import { getRandomShapes } from "./game/shapes.ts";
import Board from "./components/Board/Board.tsx";
import ShapeTray from "./components/ShapeTray/ShapeTray.tsx";

function threeSlots(): [ShapeSlot, ShapeSlot, ShapeSlot] {
  const [a, b, c] = getRandomShapes(3);
  return [a ?? null, b ?? null, c ?? null];
}

export default function App() {
  const [board] = useState<BoardState>(createEmptyBoard);
  const [shapes] = useState<[ShapeSlot, ShapeSlot, ShapeSlot]>(threeSlots);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0F1A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: 16,
      }}
    >
      <div style={{ width: "min(480px, calc(100vw - 32px))" }}>
        <Board board={board} dragState={null} />
      </div>
      <div style={{ width: "min(480px, calc(100vw - 32px))" }}>
        <ShapeTray shapes={shapes} />
      </div>
    </div>
  );
}
