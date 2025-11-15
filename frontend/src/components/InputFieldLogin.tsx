import { type ChangeEvent } from "react";

interface InputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

export default function InputFieldBasic({
  id,
  label,
  value,
  onChange,
  placeholder = label,
  type = "text",
}: InputProps) {
  return (
    <div className="relative my-6">
      <input
        id={id}
        type={type}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all"
      />
      <label
        htmlFor={id}
        className="absolute left-2 -top-2 text-xs text-slate-400 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500"
      >
        {label}
      </label>
    </div>
  );
}
