import { useState, type ChangeEvent } from "react";

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

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value);
  };

  return (
    <div className="relative my-6">
      <input
        id={id}
        name={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={handleChange}
        className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      />
      <label
        htmlFor={id}
        className="absolute -top-2 left-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all before:absolute before:left-0 before:top-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
      >
        {label}
      </label>

      {helperText && (
        <small className="absolute flex w-full justify-between px-4 py-1 text-xs text-slate-400 transition peer-invalid:text-pink-500">
          <span>{helperText}</span>
        </small>
      )}
    </div>
  );
}