import React, { useState, useRef, useEffect } from "react";
import globeIcon from "../assets/globeIcon.svg";

interface LanguageOption {
  code: string;
  label: string;
}

interface ButtonLanguageProps {
  size?: number;      // Größe der klickbaren Fläche (px)
  iconSize?: number;  // Größe des Icons selbst (px)
}

const languages: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "ws", label: "Wüstensprache" },
];

const ButtonLanguage: React.FC<ButtonLanguageProps> = ({
  size = 40,
  iconSize = 22,
}) => {
  const [open, setOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("de");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleLanguageChange = async (code: string) => {
    setCurrentLanguage(code);
    setOpen(false);

    // Für später:
    // await fetch("/api/language", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ language: code }),
    // });
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-full hover:bg-gray-100 transition"
      >
        <img
          src={globeIcon}
          alt="Change language"
          style={{ width: iconSize, height: iconSize }}
        />
      </button>

      {/* POPUP */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={() => setOpen(false)} />
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-white shadow-lg border rounded-xl p-4 z-50">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-base">Sprache wählen</span>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`text-left px-3 py-2 rounded-md transition
                    ${
                      currentLanguage === lang.code
                        ? "bg-sky-500 text-white font-semibold"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ButtonLanguage;