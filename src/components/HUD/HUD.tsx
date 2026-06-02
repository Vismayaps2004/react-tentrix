interface HUDProps {
  score: number;
  isPaused: boolean;
  onTogglePause: () => void;
}

export default function HUD({ score, isPaused, onTogglePause }: HUDProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 12,
        color: "#E0E0F0",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontSize: 11,
            color: "#9E9EBE",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Score
        </span>
        <span style={{ fontSize: 32, fontWeight: 800, color: "#4FC3F7" }}>
          {score}
        </span>
      </div>

      <button
        onClick={onTogglePause}
        style={{
          padding: "8px 20px",
          background: "transparent",
          color: "#E0E0F0",
          border: "1px solid #3A3A5A",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {isPaused ? "Resume" : "Pause"}
      </button>
    </div>
  );
}
