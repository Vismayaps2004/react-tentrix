import { useEffect, useRef } from "react";

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

export default function GameOver({ score, onRestart }: GameOverProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-title"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(14px) saturate(0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        animation: "tentrix-backdrop-in 250ms ease",
      }}
    >
      <div
        style={{
          background: "rgba(22,22,42,0.97)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: "48px 64px",
          textAlign: "center",
          color: "#E0E0F0",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.05), 0 40px 100px rgba(0,0,0,0.7)",
          animation: "tentrix-fade-in 260ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#64748B",
            marginBottom: 10,
          }}
        >
          Game
        </div>
        <h2
          id="gameover-title"
          style={{
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: "0.06em",
            marginBottom: 28,
            color: "#F87171",
            textTransform: "uppercase",
          }}
        >
          Over
        </h2>

        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#64748B",
              marginBottom: 8,
            }}
          >
            Final Score
          </div>
          <div
            aria-label={`Final score: ${score}`}
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: "#38BDF8",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {score}
          </div>
        </div>

        <button
          ref={btnRef}
          onClick={onRestart}
          aria-label="Play again"
          className="tentrix-action-btn"
          style={{
            padding: "13px 44px",
            background: "#38BDF8",
            color: "#0C0C1E",
            border: "none",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
