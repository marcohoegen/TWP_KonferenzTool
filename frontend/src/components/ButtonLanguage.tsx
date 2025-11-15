import React, { useState } from "react";
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
    <div className="relative inline-block">
      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
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
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-xl p-3 z-50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm">Sprache wählen</span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`text-left px-2 py-1 rounded-md transition
                  ${
                    currentLanguage === lang.code
                      ? "bg-blue-100 font-semibold"
                      : "hover:bg-gray-100"
                  }
                `}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonLanguage;