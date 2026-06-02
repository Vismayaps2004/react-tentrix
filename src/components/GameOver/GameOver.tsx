interface GameOverProps {
  score: number;
  onRestart: () => void;
}

export default function GameOver({ score, onRestart }: GameOverProps) {
  return (
    <div>
      <p>Game Over — Score: {score}</p>
      <button onClick={onRestart}>Restart</button>
    </div>
  );
}
