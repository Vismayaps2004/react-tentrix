import type { Shape } from "../types/index.ts";

const C = {
  gray: "#78909C",
  skyBlue: "#4FC3F7",
  blue: "#29B6F6",
  deepBlue: "#039BE5",
  navy: "#0277BD",
  green: "#66BB6A",
  darkGreen: "#388E3C",
  orange: "#FFA726",
  red: "#EF5350",
} as const;

export const SHAPES: Shape[] = [
  // Single
  { id: "s1", cells: [[0, 0]], rows: 1, cols: 1, color: C.gray },

  // 2-cell lines
  { id: "h2", cells: [[0, 0], [0, 1]], rows: 1, cols: 2, color: C.skyBlue },
  { id: "v2", cells: [[0, 0], [1, 0]], rows: 2, cols: 1, color: C.skyBlue },

  // 3-cell lines
  { id: "h3", cells: [[0, 0], [0, 1], [0, 2]], rows: 1, cols: 3, color: C.blue },
  { id: "v3", cells: [[0, 0], [1, 0], [2, 0]], rows: 3, cols: 1, color: C.blue },

  // 4-cell lines
  { id: "h4", cells: [[0, 0], [0, 1], [0, 2], [0, 3]], rows: 1, cols: 4, color: C.deepBlue },
  { id: "v4", cells: [[0, 0], [1, 0], [2, 0], [3, 0]], rows: 4, cols: 1, color: C.deepBlue },

  // 5-cell lines
  { id: "h5", cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], rows: 1, cols: 5, color: C.navy },
  { id: "v5", cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], rows: 5, cols: 1, color: C.navy },

  // 2×2 square
  { id: "sq2", cells: [[0, 0], [0, 1], [1, 0], [1, 1]], rows: 2, cols: 2, color: C.green },

  // 3×3 square
  {
    id: "sq3",
    cells: [
      [0, 0], [0, 1], [0, 2],
      [1, 0], [1, 1], [1, 2],
      [2, 0], [2, 1], [2, 2],
    ],
    rows: 3,
    cols: 3,
    color: C.darkGreen,
  },

  // Small L (3-cell, 2×2 bounding box) — 4 orientations
  // □     □□     □      □
  // □□    □.     .□    □□
  { id: "lA", cells: [[0, 0], [1, 0], [1, 1]], rows: 2, cols: 2, color: C.orange },
  { id: "lB", cells: [[0, 1], [1, 0], [1, 1]], rows: 2, cols: 2, color: C.orange },
  { id: "lC", cells: [[0, 0], [0, 1], [1, 0]], rows: 2, cols: 2, color: C.orange },
  { id: "lD", cells: [[0, 0], [0, 1], [1, 1]], rows: 2, cols: 2, color: C.orange },

  // Big L (4-cell) — 8 orientations (L & J tetromino, all rotations)
  // □.    .□    □□□    □□□
  // □.    .□    □..    ..□
  // □□    □□
  { id: "LA", cells: [[0, 0], [1, 0], [2, 0], [2, 1]], rows: 3, cols: 2, color: C.red },
  { id: "LB", cells: [[0, 1], [1, 1], [2, 0], [2, 1]], rows: 3, cols: 2, color: C.red },
  { id: "LC", cells: [[0, 0], [0, 1], [0, 2], [1, 0]], rows: 2, cols: 3, color: C.red },
  { id: "LD", cells: [[0, 0], [0, 1], [0, 2], [1, 2]], rows: 2, cols: 3, color: C.red },

  // □□    □□    ..□    □..
  // □.    .□    □□□    □□□
  // □.    .□
  { id: "LE", cells: [[0, 0], [0, 1], [1, 0], [2, 0]], rows: 3, cols: 2, color: C.red },
  { id: "LF", cells: [[0, 0], [0, 1], [1, 1], [2, 1]], rows: 3, cols: 2, color: C.red },
  { id: "LG", cells: [[0, 2], [1, 0], [1, 1], [1, 2]], rows: 2, cols: 3, color: C.red },
  { id: "LH", cells: [[0, 0], [1, 0], [1, 1], [1, 2]], rows: 2, cols: 3, color: C.red },
];

export function getRandomShapes(count: number): Shape[] {
  return Array.from(
    { length: count },
    () => SHAPES[Math.floor(Math.random() * SHAPES.length)],
  );
}
