import { useState, useRef, type ChangeEvent } from "react";
import CalendarIcon from "../assets/calendarIcon.svg";

interface InputDatePickerProps {
  id: string;
  label: string;
  defaultValue?: string;
  min?: string;
  max?: string;
  helperText?: string;
}

export default function InputDatePicker({
  id,
  label,
  defaultValue = "",
  min,
  max,
  helperText,
}: InputDatePickerProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value);
  };

  const handleIconClick = () => {
    inputRef.current?.showPicker?.(); // moderne Browser: öffnet das native Picker-Popup
    inputRef.current?.focus();         // Fallback: focus
  };

  return (
    <div className="relative my-6">
      <input
        ref={inputRef}
        id={id}
        name={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={handleChange}
        className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      />

      <label
        htmlFor={id}
        className="absolute -top-2 left-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500"
      >
        {label}
      </label>

      {/* Klickbares Icon */}
      <div
        className="absolute right-2 top-2.5 h-5 w-5 cursor-pointer"
        onClick={handleIconClick}
      >
        <img src={CalendarIcon} alt="Calendar" />
      </div>

      {helperText && (
        <small className="absolute flex w-full justify-between px-4 py-1 text-xs text-slate-400 transition peer-invalid:text-pink-500">
          {helperText}
        </small>
      )}
    </div>
  );
}
