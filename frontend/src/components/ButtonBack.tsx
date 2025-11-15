import backIcon from "../assets/backIcon.svg";

/* 
    <BackIconButton onClick={() => navigate(-1)} />

    oder im header:
    <div className="flex items-center gap-2">
        <BackIconButton onClick={() => router.back()} />
        <h1 className="text-lg font-semibold">Einstellungen</h1>
    </div>
*/

interface BackIconButtonProps {
  onClick?: () => void;
  size?: number;        // z. B. 20, 24, 32
  className?: string;   // optional Tailwind-Klassen
}

export default function ButtonBack({
  onClick,
  size = 24,
  className = "",
}: BackIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center p-1 rounded hover:bg-slate-100 transition ${className}`}
      aria-label="Zurück"
    >
      <img
        src={backIcon}
        alt=""
        style={{ width: size, height: size }}
        className="pointer-events-none select-none"
      />
    </button>
  );
}
