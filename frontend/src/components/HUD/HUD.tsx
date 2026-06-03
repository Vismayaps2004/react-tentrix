const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <rect x="2" y="1" width="4" height="12" rx="1" />
    <rect x="8" y="1" width="4" height="12" rx="1" />
  </svg>
);

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <path d="M3 1.5L12.5 7L3 12.5V1.5Z" />
  </svg>
);

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
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding: "10px 16px",
        marginBottom: 10,
      }}
    >
      <div
        aria-live="polite"
        aria-label={`Score: ${score}`}
        style={{ lineHeight: 1 }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#64748B",
            marginBottom: 3,
          }}
        >
          Score
        </div>
        <div
          aria-hidden="true"
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#38BDF8",
            letterSpacing: "-0.02em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {score}
        </div>
      </div>

      <button
        onClick={onTogglePause}
        aria-label={isPaused ? "Resume game" : "Pause game"}
        className="tentrix-pause-btn"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "8px 14px",
          background: "transparent",
          color: "#94A3B8",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {isPaused ? <PlayIcon /> : <PauseIcon />}
        {isPaused ? "Resume" : "Pause"}
      </button>
    </div>
  );
}
