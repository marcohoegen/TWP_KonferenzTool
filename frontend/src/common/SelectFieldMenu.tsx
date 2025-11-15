// src/common/SelectFieldMenu.tsx
import { useEffect, useState } from "react";

interface SelectOption { value: string; label: string; }
interface SelectProps {
  id: string;
  label: string;
  width?: string;           // e.g. "w-full sm:w-40"
  options: SelectOption[];
  required?: boolean;
  value?: string;           // optional controlled
  onChange?: (val: string)=> void;
}

export default function SelectFieldMenu({
  id,
  label,
  width = "w-60",
  options,
  required = false,
  value,
  onChange,
}: SelectProps) {
  const [internal, setInternal] = useState<string>(value ?? "");
  const selectedValue = value ?? internal;

  useEffect(() => {
    if (typeof value === "string") setInternal(value);
  }, [value]);

  const setValue = (v: string) => {
    setInternal(v);
    onChange?.(v);
  };

  return (
    <div className={`relative my-6 ${width}`}>
      {/* floating label */}
      <label
        htmlFor={id}
        className="pointer-events-none absolute -top-2 left-2 z-[1] px-2 text-xs text-slate-400 bg-white"
      >
        {label}{required && <span className="text-pink-500"> *</span>}
      </label>

      <select
        id={id}
        value={selectedValue}
        onChange={(e) => setValue(e.target.value)}
        aria-required={required}
        className="h-10 w-full rounded border border-slate-200 bg-white px-4 text-sm text-slate-700 text-left
                   outline-none transition focus:border-sky-500 appearance-none"
      >
        {/* placeholder option when nothing selected */}
        <option value="" disabled hidden>
          {label}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* right arrow (keeps visual from old component) */}
      <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </span>
    </div>
  );
}
