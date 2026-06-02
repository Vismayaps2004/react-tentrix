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

  return { state, place };
}
