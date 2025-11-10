import { useState } from "react";

/* Beispiel:
  <InputFieldTime label="Startzeit" stepMinutes={15} width="w-1/2" />
  <InputFieldTime label="Endzeit"   stepMinutes={5}  width="w-1/2" />
*/

interface InputFieldTimeProps {
  id?: string;
  label?: string;
  width?: string;     // z.B. "w-full", "w-40"
  height?: string;    // z.B. "h-10"
  stepMinutes?: number; // Schrittweite in MINUTEN (wird in Sekunden umgerechnet)
  min?: string;       // optional: "08:00"
  max?: string;       // optional: "18:00"
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (v: string) => void;
}

export default function InputFieldTime({
  id = "id-time",
  label = "Uhrzeit wählen",
  width = "w-full",
  height = "h-10",
  stepMinutes = 15,
  min,
  max,
  required,
  disabled,
  value,
  onChange,
}: InputFieldTimeProps) {
  const [internal, setInternal] = useState(value ?? "");
  const val = value ?? internal;

  const handleChange = (v: string) => {
    setInternal(v);
    onChange?.(v);
  };

  return (
    <div className={`relative my-6 ${width}`}>
      <input
        id={id}
        name={id}
        type="time"
        value={val}
        onChange={(e) => handleChange(e.target.value)}
        step={stepMinutes * 60}   // ⇐ iOS Scroll-Wheel mit deiner Schrittweite
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        inputMode="numeric"
        className={`peer ${height} w-full rounded border border-slate-200 bg-white px-4
                    text-sm text-slate-700 outline-none transition
                    focus:border-sky-500 disabled:cursor-not-allowed
                    disabled:bg-slate-50 disabled:text-slate-400`}
      />
      
      <label
        htmlFor={id}
        className="pointer-events-none absolute -top-2 left-2 z-[1] bg-white px-1
                   text-xs text-slate-400 transition peer-focus:text-sky-500"
      >
        {label}{required && <span className="text-pink-500"> *</span>}
      </label>
    </div>
  );
}