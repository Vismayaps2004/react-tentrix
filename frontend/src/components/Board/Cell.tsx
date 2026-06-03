import type { CellColor } from "../../types/index.ts";

type PreviewState = "valid" | "invalid" | null;

const GRADIENT_HIGHLIGHT = "linear-gradient(145deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0) 55%)";

function cellClass(color: CellColor, preview: PreviewState): string {
  if (preview === "valid") return "tentrix-cell tentrix-cell-preview-valid";
  if (preview === "invalid") return "tentrix-cell tentrix-cell-preview-invalid";
  if (color) return "tentrix-cell tentrix-cell-filled";
  return "tentrix-cell tentrix-cell-empty";
}

interface CellProps {
  color: CellColor;
  previewState?: PreviewState;
}

export default function Cell({ color, previewState = null }: CellProps) {
  // Empty cells get no inline background so CSS :hover works cleanly.
  // Filled and preview cells get an inline gradient + base color.
  const bg = color ? `${GRADIENT_HIGHLIGHT}, ${color}` : undefined;

  return (
    <div
      className={cellClass(color, previewState)}
      style={bg ? { background: bg } : undefined}
    />
  );
}
