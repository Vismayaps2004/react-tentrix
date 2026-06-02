import { useGame } from "./hooks/useGame.ts";
import { useDragDrop } from "./hooks/useDragDrop.ts";
import Board from "./components/Board/Board.tsx";
import ShapeTray from "./components/ShapeTray/ShapeTray.tsx";

export default function App() {
  const { state, place } = useGame();
  const { dragState, previewCells, startDrag, setBoardRef } = useDragDrop(
    state.board,
    state.shapes,
    place,
  );

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
        <Board
          board={state.board}
          dragState={dragState}
          previewCells={previewCells}
          containerRef={setBoardRef}
        />
      </div>
      <div style={{ width: "min(480px, calc(100vw - 32px))" }}>
        <ShapeTray
          shapes={state.shapes}
          activeDragIndex={dragState?.shapeIndex ?? null}
          onDragStart={startDrag}
        />
      </div>
    </div>
  );
}
