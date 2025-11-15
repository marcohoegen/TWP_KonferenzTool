import { useState } from "react";
import trashIcon from "../assets/trashbinIcon.svg";

interface ButtonTrashbinProps {
  size?: number;
  className?: string;
  confirmText?: string;      // Text im Popup
  onConfirm?: () => void;    // Wird ausgeführt, wenn "Löschen" bestätigt wird
}

export default function ButtonTrashbin({
  size = 24,
  className = "",
  confirmText = "Soll dieses Element wirklich gelöscht werden?",
  onConfirm,
}: ButtonTrashbinProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trash-Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center justify-center p-1 rounded hover:bg-red-100 transition ${className}`}
        aria-label="Löschen"
      >
        <img
          src={trashIcon}
          alt="Trash icon"
          style={{ width: size, height: size }}
          className="pointer-events-none select-none"
        />
      </button>

      {/* Modal / Popup */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-slate-700 mb-3">Bestätigung</h2>

            <p className="text-slate-600 mb-6">
              {confirmText}
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200"
                onClick={() => setOpen(false)}
              >
                Abbrechen
              </button>

              <button
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                onClick={() => {
                  setOpen(false);
                  onConfirm?.();
                }}
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
