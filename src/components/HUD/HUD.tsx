interface HUDProps {
  score: number;
  onPause: () => void;
}

export default function HUD({ score, onPause }: HUDProps) {
  return (
    <div>
      <span>Score: {score}</span>
      <button onClick={onPause}>Pause</button>
    </div>
  );
}
