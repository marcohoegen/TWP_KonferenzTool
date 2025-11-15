import { useState } from "react";
import toolOptionIcon from "../assets/toolOptionIcon.svg";

interface ButtonOptionProps {
  size?: number; // Größe des Icons in Pixel
}

export default function ButtonOptions({ size = 28 }: ButtonOptionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Icon Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-1 hover:opacity-70 active:scale-95 transition"
        style={{ width: size, height: size }}
      >
        <img
          src={toolOptionIcon}
          alt="Tool Options"
          style={{ width: size, height: size }}
          className="pointer-events-none select-none"
        />
      </button>

      {/* MODAL / POPUP */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[300px] relative">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-3 text-slate-700">
              Optionen
            </h2>

            <p className="text-sm text-slate-500">
              Hier können später Einstellungen oder Konfigurationsoptionen angezeigt werden.
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
