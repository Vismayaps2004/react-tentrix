import { useState } from "react";
import type { GameState } from "../types/index.ts";
import { createInitialState } from "../game/gameEngine.ts";

export function useGame() {
  const [state, setState] = useState<GameState>(createInitialState);
  return { state, setState };
}
