import { useState } from "react";

    {/*  Nutzung:
        <ButtonLoadingAnimated 
        text={"Einloggen"} 
        loadingText={"Wird geladen..."} 
        onClick={async () => {
        // z. B. API-Aufruf simulieren
        await new Promise((r) => setTimeout(r, 2000));
        alert("Fertig!");
        }} />
        
        */}

interface ButtonLoadingAnimatedProps {
  text?: string;
  loadingText?: string;
  onClick?: () => Promise<void> | void; // unterstützt async-Funktionen
}

export default function ButtonLoadingAnimated({
  text = "Import starten",
  loadingText = "Wird geladen...",
  onClick,
}: ButtonLoadingAnimatedProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return; // Doppelklick verhindern
    setIsLoading(true);
    try {
      if (onClick) await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/*<!-- Component: Large primary button with animation --> */}
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="inline-flex items-center justify-center h-12 gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 rounded justify-self-center whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
      >
        {/* Text */}
        <span>{isLoading ? loadingText : text}</span>

        {/* Spinner (nur bei Ladezustand) */}
        {isLoading && (
          <span className="relative only:-mx-6">
            <svg
              className="w-5 h-5 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              role="graphics-symbol"
              aria-labelledby="title-05 desc-05"
            >
              <title id="title-05">Loading</title>
              <desc id="desc-05">Button loading animation</desc>
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        )}
      </button>
      {/*<!-- End Large primary button with animation --> */}
    </>
  );
}
