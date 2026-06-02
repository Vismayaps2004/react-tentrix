import { useCallback, useReducer } from "react";
import { createInitialState, gameReducer } from "../game/gameEngine.ts";

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  const place = useCallback(
    (shapeIndex: number, anchorRow: number, anchorCol: number) => {
      dispatch({ type: "PLACE", shapeIndex, anchorRow, anchorCol });
    },
    [],
  );

  const restart = useCallback(() => dispatch({ type: "RESTART" }), []);

  const togglePause = useCallback(() => dispatch({ type: "TOGGLE_PAUSE" }), []);

  return { state, place, restart, togglePause };
}
