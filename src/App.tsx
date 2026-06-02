import { useGame } from "./hooks/useGame.ts";
import { useDragDrop } from "./hooks/useDragDrop.ts";
import Board from "./components/Board/Board.tsx";
import ShapeTray from "./components/ShapeTray/ShapeTray.tsx";
import HUD from "./components/HUD/HUD.tsx";
import Paused from "./components/Paused/Paused.tsx";
import GameOver from "./components/GameOver/GameOver.tsx";

export default function App() {
  const { state, place, restart, togglePause } = useGame();
  const isPaused = state.screen === "paused";

  const { dragState, previewCells, startDrag, setBoardRef } = useDragDrop(
    state.board,
    state.shapes,
    place,
    state.screen === "playing", // disable drag when paused or game over
  );

  const gameWidth = "min(480px, calc(100vw - 32px))";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0F1A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div style={{ width: gameWidth }}>
        <HUD
          score={state.score}
          isPaused={isPaused}
          onTogglePause={togglePause}
        />
        <Board
          board={state.board}
          dragState={dragState}
          previewCells={previewCells}
          containerRef={setBoardRef}
        />
        <ShapeTray
          shapes={state.shapes}
          activeDragIndex={dragState?.shapeIndex ?? null}
          onDragStart={isPaused ? undefined : startDrag}
        />
      </div>

      {isPaused && <Paused onResume={togglePause} />}
      {state.screen === "gameover" && (
        <GameOver score={state.score} onRestart={restart} />
      )}
    </div>
  );
}
