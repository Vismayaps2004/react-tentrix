import { useEffect, useRef } from "react";

interface PausedProps {
  onResume: () => void;
}

export default function Paused({ onResume }: PausedProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Game paused"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(10px) saturate(0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        animation: "tentrix-backdrop-in 200ms ease",
      }}
    >
      <div
        style={{
          background: "rgba(22,22,42,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: "44px 60px",
          textAlign: "center",
          color: "#E0E0F0",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.05), 0 32px 80px rgba(0,0,0,0.6)",
          animation: "tentrix-fade-in 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
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
          style={{
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: "0.06em",
            marginBottom: 32,
            color: "#38BDF8",
            textTransform: "uppercase",
          }}
        >
          Paused
        </h2>
        <button
          ref={btnRef}
          onClick={onResume}
          aria-label="Resume game"
          className="tentrix-action-btn"
          style={{
            padding: "13px 40px",
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
          Resume
        </button>
      </div>
    </div>
  );
}
