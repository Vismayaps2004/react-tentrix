interface PausedProps {
  onResume: () => void;
}

export default function Paused({ onResume }: PausedProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "#1E1E2E",
          borderRadius: 16,
          padding: "40px 56px",
          textAlign: "center",
          color: "#E0E0F0",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        <h2
          style={{
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: 4,
            marginBottom: 28,
            color: "#4FC3F7",
          }}
        >
          PAUSED
        </h2>
        <button
          onClick={onResume}
          style={{
            padding: "14px 40px",
            background: "#4FC3F7",
            color: "#0F0F1A",
            border: "none",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 1,
          }}
        >
          RESUME
        </button>
      </div>
    </div>
  );
}
