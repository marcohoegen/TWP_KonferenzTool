// src/common/SelectFieldMenu.tsx
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

interface SelectOption { value: string; label: string; }
interface SelectProps {
  id: string;
  label: string;
  width?: string;           // z. B. "w-full sm:w-40"
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
  // Uncontrolled fallback, wenn kein value/onChange übergeben wird
  const [internal, setInternal] = useState<string>(value ?? "");
  const selectedValue = value ?? internal;
  const selected = options.find(o => o.value === selectedValue) || null;

  const setValue = (v: string) => {
    setInternal(v);
    onChange?.(v);
  };

  return (
    <div className={`relative my-6 ${width}`}>
      {/* Button (Eingabefeld) */}
      <Listbox value={selectedValue} onChange={setValue}>
        <div className="relative">
          {/* Label (floating look) */}
          <label
            htmlFor={id}
            className="pointer-events-none absolute -top-2 left-2 z-[1] px-2 text-xs text-slate-400 bg-white"
          >
            {label}{required && <span className="text-pink-500"> *</span>}
          </label>

          {/* Feld */}
          <Listbox.Button
            id={id}
            className="h-10 w-full rounded border border-slate-200 bg-white px-4 text-sm text-slate-700 text-left
                       outline-none transition focus:border-emerald-500"
            aria-required={required}
          >
            {selected ? selected.label : <span className="text-slate-400">{label}</span>}
            {/* Pfeil rechts */}
            <span className="absolute inset-y-0 right-2 flex items-center">
              <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </Listbox.Button>

          {/* Optionen – erscheinen UNTER dem Feld */}
          <Transition as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-slate-200
                         bg-white py-2 text-sm shadow-lg focus:outline-none"
            >
              {options.map(opt => (
                <Listbox.Option
                  key={opt.value}
                  value={opt.value}
                  className={({ active, selected }) =>
                    `cursor-pointer px-4 py-2 ${
                      active ? "bg-emerald-50" : ""
                    } ${selected ? "font-medium text-emerald-700" : "text-slate-700"}`
                  }
                >
                  {opt.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
