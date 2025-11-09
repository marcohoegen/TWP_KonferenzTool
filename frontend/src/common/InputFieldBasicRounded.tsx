import { useState, type ChangeEvent } from "react";

interface InputProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  width?: string;  // z. B. "w-full", "w-1/2", "w-64"
  height?: string; // z. B. "h-10", "h-12", "h-8"
}

export default function FormElementsInputRoundedBaseBasic({
  id,
  label,
  placeholder = label,
  type = "text",
  width = "w-full",
  height = "h-10",
}: InputProps) {
  const [value, setValue] = useState("");

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value);
  };

  return (
    <div className={`relative my-6 ${width}`}>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={`peer relative ${height} w-full rounded border border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
      />
      <label
        htmlFor={id}
        className="absolute left-4 -top-2 z-[1] cursor-text px-1 text-xs text-slate-400 transition-all
          before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full
          before:bg-white before:transition-all
          peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm
          peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\\00a0*']
          peer-invalid:text-pink-500
          peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-sky-500
          peer-invalid:peer-focus:text-pink-500
          peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
      >
        {label}
      </label>
    </div>
  );
}
