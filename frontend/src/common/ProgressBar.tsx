import { useEffect, useState } from "react";

/* 
    <ProgressBar
      startTime="2025-01-01T10:00:00Z"
      endTime="2025-01-01T12:00:00Z"
      label="Konferenz läuft"
      direction="fill"   // oder "empty"
    />
*/

interface ProgressBarProps {
  startTime: string; 
  endTime: string;     
  label?: string;     
  direction?: "fill" | "empty"; 
}

export default function ProgressBar({
  startTime,
  endTime,
  label = "",
  direction = "fill"   
}: ProgressBarProps) {

  const [progress, setProgress] = useState(0);
  const [remainingText, setRemainingText] = useState("");

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    const update = () => {
      const now = Date.now();


      if (now < start) {
        setProgress(0);
        const secondsUntilStart = Math.floor((start - now) / 1000);
        setRemainingText(formatTime(secondsUntilStart) + " bis zum Start");
        return;
      }

      if (now >= end) {
        setProgress(direction === "fill" ? 100 : 0);
        setRemainingText("Beendet");
        return;
      }

      const total = end - start;
      const elapsed = now - start;
      const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
      const displayProgress = direction === "fill" ? percent : 100 - percent;

      setProgress(displayProgress);

      const remainingSeconds = Math.floor((end - now) / 1000);

      setRemainingText(
        formatTime(remainingSeconds) +
          (direction === "fill" ? "verbleibend" : "verbleibend")
      );
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);

  }, [startTime, endTime, direction]);

  return (
    <div className="relative w-full">
      <label className="mb-1 block text-right text-xs text-slate-400">
        {label && <span className="mr-2">{label}</span>}
        {remainingText}
      </label>

      <progress
        max={100}
        value={progress}
        className="block w-full overflow-hidden rounded bg-slate-100 
                   [&::-webkit-progress-bar]:bg-slate-100 
                   [&::-webkit-progress-value]:bg-emerald-500 
                   [&::-moz-progress-bar]:bg-emerald-500"
      >
        {Math.floor(progress)}%
      </progress>
    </div>
  );
}

// Das eventuell noch außerhalb erstellen als Standardfunktion
function formatTime(seconds: number): string {
  if (seconds <= 0) return "0s";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
