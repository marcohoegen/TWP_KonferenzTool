{/* 
  Nutzung:
  <ErrorPopup title={"Fehler beim Einloggen"} message={"Falsches Passwort."} visible={true} position="bottom" />
  */}


interface ErrorPopupProps {
  title?: string;
  message?: string;
  visible?: boolean;     // Sichtbarkeit
  onClose?: () => void;  // Optional: Schließen-Callback
  position?: "top" | "bottom" | "top-right" | "bottom-right"; // frei positionierbar
}

export default function ErrorPopup({
  title = "Ein Fehler ist aufgetreten!",
  message = "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
  visible = true,
  onClose,
  position = "top-right",
}: ErrorPopupProps) {
  if (!visible) return null;

  // Positionierung anhand der Prop
  const positionClasses = {
    top: "top-4 left-1/2 -translate-x-1/2",
    bottom: "bottom-4 left-1/2 -translate-x-1/2",
    "top-right": "top-4 right-4",
    "bottom-right": "bottom-4 right-4",
  }[position];

  return (
    <div
      className={`fixed z-50 ${positionClasses} flex items-start gap-4 rounded border border-pink-100 bg-pink-50 px-4 py-3 text-sm text-pink-600 shadow-lg transition-all duration-300`}
      role="alert"
    >
      {/* <!-- Icon --> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        role="graphics-symbol"
        aria-labelledby="title-error desc-error"
      >
        <title id="title-error">Fehler-Icon</title>
        <desc id="desc-error">Ein Symbol, das einen Fehler anzeigt</desc>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      {/* <!-- Textbereich --> */}
      <div className="flex-1 pr-6">
        <h3 className="mb-1 font-semibold">{title}</h3>
        <p className="text-sm">{message}</p>
      </div>

      {/* <!-- Close Button --> */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-pink-400 hover:text-pink-600 transition"
          aria-label="Popup schließen"
        >
          ✕
        </button>
      )}
    </div>
  );
}
