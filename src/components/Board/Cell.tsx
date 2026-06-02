import type { CellColor } from "../../types/index.ts";

const EMPTY_COLOR = "#1E1E2E";

interface CellProps {
  color: CellColor;
  row: number;
  col: number;
}

export default function Cell({ color }: CellProps) {
  return (
    <div
      style={{
        background: color ?? EMPTY_COLOR,
        borderRadius: 3,
        transition: "background 120ms ease",
      }}
    />
  );
}
