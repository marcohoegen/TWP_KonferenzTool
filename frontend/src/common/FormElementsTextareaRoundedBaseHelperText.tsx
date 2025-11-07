import { useState, type ChangeEvent } from "react";

interface TextareaProps {
  id: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  defaultValue?: string;
  rows?: number;
}

export default function FormElementsTextareaRoundedBaseHelperText({
  id,
  label,
  placeholder = label,
  helperText,
  defaultValue = "",
  rows = 3,
}: TextareaProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(evt.target.value);
  };

  return (
    <div className="relative my-6">
      <textarea
        id={id}
        name={id}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="peer relative w-full rounded border border-slate-200 px-4 py-2 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      ></textarea>

      <label
        htmlFor={id}
        className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
      >
        {label}
      </label>

      {helperText && (
        <small className="absolute flex w-full justify-between px-4 py-1 text-xs text-slate-400 transition peer-invalid:text-pink-500">
          <span>{helperText}</span>
          <span className="text-slate-500">{value.length}/500</span>
        </small>
      )}
    </div>
  );
}