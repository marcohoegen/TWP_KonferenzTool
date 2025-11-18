import { useState, type ChangeEvent, type FocusEvent } from "react";

interface InputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  initialValue?: string;
}

export default function InputFieldPassword({
  id,
  label,
  value,
  onChange,
  initialValue = "", // initialer Text
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleFocus = (evt: FocusEvent<HTMLInputElement>) => {
    if (!cleared) {
      // Erstes Reinklicken: Text löschen
      onChange({
        ...evt,
        target: { ...evt.target, value: "" },
      } as ChangeEvent<HTMLInputElement>);
      setCleared(true);
    }
  };

  return (
    <div className="relative my-6">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        name={id}
        value={cleared ? value : initialValue}
        onFocus={handleFocus}
        onChange={onChange}
        className="peer relative h-10 w-full border-b border-slate-200 px-4 pr-12 text-sm text-slate-500 placeholder-transparent outline-none transition-all"
      />

      <label
        htmlFor={id}
        className="absolute left-2 -top-2 text-xs text-slate-400 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500"
      >
        {label}
      </label>

      {/* Show/Hide Icon */}
      {showPassword ? (
        <svg
          onClick={() => setShowPassword(!showPassword)}
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-2.5 right-4 h-5 w-5 cursor-pointer stroke-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ) : (
        <svg
          onClick={() => setShowPassword(!showPassword)}
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-2.5 right-4 h-5 w-5 cursor-pointer stroke-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      )}
    </div>
  );
}
