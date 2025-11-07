import { useState } from "react";

{/* Beispiel für Nutzung:
  <InputFieldTime label="Startzeit" stepMinutes={15} width="w-1/2" />
  <InputFieldTime label="Endzeit" stepMinutes={15} width="w-1/2" />
        */}

interface InputFieldTimeProps {
  id?: string;
  label?: string;
  width?: string;  
  height?: string; 
  stepMinutes?: number; 
}

export default function InputFieldTime({
  id = "id-time",
  label = "Uhrzeit wählen",
  width = "w-full",
  height = "h-10",
  stepMinutes = 15,
}: InputFieldTimeProps) {
  const [value, setValue] = useState("");
  const generateTimeOptions = (step: number) => {
    const options: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += step) {
        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        options.push(`${hh}:${mm}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions(stepMinutes);

  return (
    <div className={`relative my-6 ${width}`}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`peer relative ${height} w-full rounded border border-slate-200 px-4 text-sm text-slate-500
          outline-none transition-all autofill:bg-white
          focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
      >
        <option value="" disabled hidden>
          {label}
        </option>
        {timeOptions.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <label
        htmlFor={id}
        className="absolute left-4 -top-2 z-[1] cursor-text px-1 text-xs text-slate-400 transition-all
          before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full
          before:bg-white before:transition-all
          peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm
          peer-required:after:text-pink-500 peer-required:after:content-['\\00a0*']
          peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-emerald-500
          peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
      >
        {label}
      </label>
    </div>
  );
}
