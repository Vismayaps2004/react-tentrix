# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TenTrix** is a Tetris-inspired browser puzzle game built with React + TypeScript, using Deno as the runtime and Vite as the bundler. It's a monorepo with a `frontend/` (the full game) and a `backend/` (scaffold only — no endpoints yet).

## Commands

All tasks are run from the repo root via `deno task`:

```bash
deno task frontend:dev       # Vite dev server
deno task frontend:build     # Production build
deno task frontend:test      # Run all frontend tests
deno task backend:dev        # Backend (watch mode, no-op currently)
```

Within `frontend/`:
```bash
deno check src/**/*.tsx src/**/*.ts   # Type check
deno test src/                        # All tests
deno test src/game/board.test.ts      # Single test file
```

## Architecture

### Directory Structure

```
frontend/src/
  game/          # Pure game logic (no React)
  hooks/         # React hooks bridging logic and UI
  components/    # Presentational React components
  types/         # Shared TypeScript types
  styles/        # CSS (reset + game styles)
```

### Data Flow

```
App.tsx
  ├── useGame()        → GameState via useReducer + dispatch
  ├── useDragDrop()    → drag state, previewCells, pointer handlers
  └── renders: HUD, Board, ShapeTray, Paused, GameOver modals
```

**State lives entirely in `useGame`** (no external store). `useDragDrop` reads a snapshot of GameState via `useRef` to preserve closure state during drag operations.

### Game State

```typescript
{
  screen: "playing" | "paused" | "gameover"
  board: (string | null)[][]   // 10x10 grid; cells hold hex color or null
  shapes: ShapeSlot[]          // 3 tray slots; null when empty
  score: number
  dragState: { shapeIndex, grabOffset, hoverCell } | null
}
```

### Key Files

| File | Responsibility |
|------|----------------|
| `game/shapes.ts` | 25 shape definitions as `[rowOffset, colOffset][]` + random picker |
| `game/board.ts` | `canPlace`, `placeShape`, `clearLines`, `isGameOver` |
| `game/gameEngine.ts` | useReducer logic for PLACE, RESTART, TOGGLE_PAUSE |
| `hooks/useGame.ts` | Wraps gameEngine in a React hook |
| `hooks/useDragDrop.ts` | Pointer event handling, grab offset, preview cell computation |

## Testing

Tests use Deno's native test runner with `@std/assert`. ~58 tests covering board logic, shape catalogue validation, and the full game reducer. There are no component/UI tests.

## Implementation Notes

- **Shapes** are identified by hex color strings — no image assets, no shape IDs.
- **Rotations** are separate shape definitions, not computed transforms.
- **Game over** is detected by checking if any of the 3 tray shapes has at least one valid placement on the current board.
- **Drag preview** renders at 72% opacity for valid placements, red (`rgba(248,113,113,0.55)`) for invalid.
- **Styling** is vanilla CSS + inline styles. No Tailwind or CSS-in-JS. Dynamic layout values use inline styles; interaction states use CSS classes.
