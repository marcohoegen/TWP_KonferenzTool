import { useEffect, useRef, useState } from "react";

interface ToggleStandardProps {
  label?: string;       // Text neben dem Toggle
  size?: number;        // Höhe des Toggles in px (Breite wird automatisch berechnet)
  id?: string;          // Optional: eigene ID setzen
  checked?: boolean;    // Optional: von außen steuern
  onChange?: (value: boolean) => void; // Callback bei Änderung
}

export default function ToggleStandard({
  label = "Primary basic",
  size = 24,
  id,
  checked,
  onChange,
}: ToggleStandardProps) {
  const generatedIdRef = useRef(id || "toggle-" + Math.random().toString(36).slice(2, 9));
  const generatedId = generatedIdRef.current;

  // controlled/uncontrolled handling
  const [internalChecked, setInternalChecked] = useState<boolean>(!!checked);
  useEffect(() => {
    if (typeof checked === "boolean") setInternalChecked(checked);
  }, [checked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    // update internal state only if component is uncontrolled from parent
    if (typeof checked !== "boolean") setInternalChecked(next);
    onChange?.(next);
  };

  // Berechnete Werte für Anpassbarkeit
  const height = size;
  const width = size * 2;

  // ensure some internal padding so the round knob never touches corners
  const padding = Math.max(2, Math.round(size * 0.08));
  const knobSize = Math.max(8, size - padding * 2); // circle inside the track
  const knobCheckedLeft = width - knobSize - padding;
  const knobUncheckedLeft = padding;

  return (
    <div className="relative flex flex-wrap items-center">
      <input
        id={generatedId}
        type="checkbox"
        checked={internalChecked}
        onChange={handleChange}
        role="switch"
        aria-checked={internalChecked}
        // keep Tailwind classes for colors/hover/focus, but ensure overflow/box-sizing and remove fixed rounded class
        className={`
          peer relative cursor-pointer appearance-none
          bg-slate-300 transition-colors
          after:absolute after:rounded-full
          checked:bg-emerald-200 checked:after:bg-emerald-500
          hover:bg-slate-400 checked:hover:bg-emerald-300
          focus:outline-none checked:focus:bg-emerald-400
          disabled:cursor-not-allowed
          disabled:bg-slate-200
        `}
        style={{
          width,
          height,
          borderRadius: height / 2, // pill shape exactly half the height
          overflow: "hidden",       // clip the knob inside the rounded track
          boxSizing: "border-box",
          padding: 0,
        }}
      />

      {/* precise pseudo-element sizing/positioning so knob always fits */}
      <style>
        {`
          /* unchecked knob = black */
          #${generatedId}::after {
            width: ${knobSize}px;
            height: ${knobSize}px;
            top: ${Math.round((height - knobSize) / 2)}px;
            left: ${knobUncheckedLeft}px;
            border-radius: 9999px;
            transition: left 180ms ease, background-color 180ms ease, transform 180ms ease;
            box-shadow: 0 1px 2px rgba(0,0,0,0.08);
            background-color: #000; /* black when unchecked */
            content: "";
          }
          /* checked knob color (keeps emerald) */
          #${generatedId}:checked::after {
            left: ${knobCheckedLeft}px;
            background-color: #10b981; /* emerald-500 */
          }
          /* disabled state: lighter knob */
          #${generatedId}:disabled::after {
            background-color: #94a3b8; /* slate-400-ish */
            box-shadow: none;
          }
        `}
      </style>

      <label
        htmlFor={generatedId}
        className="cursor-pointer pl-2 text-slate-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
      >
        {label}
      </label>
    </div>
  );
}