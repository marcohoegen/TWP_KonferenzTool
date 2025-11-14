import { useState, useRef, useEffect } from "react";

/* Verwendung:
    // Uncontrolled with backend sync
<CheckboxBasic 
  label="Notify me" 
  apiEndpoint="http://localhost:3000/api/user/notify"
/>

// Controlled
<CheckboxBasic 
  label="Accept terms" 
  checked={termsAccepted}
  onChange={(checked) => setTermsAccepted(checked)}
/>

// With custom callback
<CheckboxBasic 
  label="Enable feature"
  onSubmit={async (checked) => {
    await saveFeatureState(checked);
  }}
/>
*/

interface CheckboxBasicProps {
  label?: string;
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onSubmit?: (checked: boolean) => Promise<void>;
  disabled?: boolean;
  apiEndpoint?: string; // backend endpoint for syncing
  isPlaceholder?: boolean; // showcase/placeholder mode
}

export default function CheckboxBasic({
  label = "Primary Checkbox",
  id,
  checked: controlledChecked,
  onChange,
  onSubmit,
  disabled = false,
  apiEndpoint,
  isPlaceholder = false,
}: CheckboxBasicProps) {
  const generatedIdRef = useRef(id || "checkbox-" + Math.random().toString(36).slice(2, 9));
  const generatedId = generatedIdRef.current;

  const [checked, setChecked] = useState(!!controlledChecked);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // sync external checked prop changes
  useEffect(() => {
    if (typeof controlledChecked === "boolean") {
      setChecked(controlledChecked);
    }
  }, [controlledChecked]);

  const handleChange = async (newChecked: boolean) => {
    // in placeholder mode, just toggle without backend calls
    if (isPlaceholder) {
      setChecked(newChecked);
      onChange?.(newChecked);
      return;
    }

    setChecked(newChecked);
    onChange?.(newChecked);

    // if apiEndpoint provided, sync to backend
    if (apiEndpoint) {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checked: newChecked }),
        });
        if (!res.ok) throw new Error("Fehler beim Speichern");
      } catch (err) {
        setError((err as Error).message);
        // revert on error
        setChecked(!newChecked);
      } finally {
        setLoading(false);
      }
    }

    // if onSubmit callback provided, call it
    onSubmit?.(newChecked);
  };

  return (
    <>
      <div className="relative flex flex-wrap items-center">
        <input
          className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-slate-500 bg-white transition-colors checked:border-emerald-500 checked:bg-emerald-500 checked:hover:border-emerald-600 checked:hover:bg-emerald-600 focus:outline-none checked:focus:border-emerald-700 checked:focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
          type="checkbox"
          id={generatedId}
          checked={checked}
          onChange={(e) => handleChange(e.target.checked)}
          disabled={disabled || loading || isPlaceholder}
          aria-label={label}
        />
        <label
          className="cursor-pointer pl-2 text-slate-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
          htmlFor={generatedId}
        >
          {label}
        </label>
        <svg
          className="pointer-events-none absolute left-0 top-1 h-4 w-4 -rotate-90 fill-white stroke-white opacity-0 transition-all duration-300 peer-checked:rotate-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          aria-labelledby="title-1 description-1"
          role="graphics-symbol"
        >
          <title id="title-1">Check mark icon</title>
          <desc id="description-1">
            Check mark icon to indicate whether the checkbox input is checked or not.
          </desc>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.8116 5.17568C12.9322 5.2882 13 5.44079 13 5.5999C13 5.759 12.9322 5.91159 12.8116 6.02412L7.66416 10.8243C7.5435 10.9368 7.37987 11 7.20925 11C7.03864 11 6.87501 10.9368 6.75435 10.8243L4.18062 8.42422C4.06341 8.31105 3.99856 8.15948 4.00002 8.00216C4.00149 7.84483 4.06916 7.69434 4.18846 7.58309C4.30775 7.47184 4.46913 7.40874 4.63784 7.40737C4.80655 7.406 4.96908 7.46648 5.09043 7.57578L7.20925 9.55167L11.9018 5.17568C12.0225 5.06319 12.1861 5 12.3567 5C12.5273 5 12.691 5.06319 12.8116 5.17568Z"
          />
        </svg>
      </div>

      {/* Error message */}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      
      {/* Loading state */}
      {loading && <p className="text-xs text-slate-400 mt-1">Speichern...</p>}

      {/* Placeholder indicator */}
      {isPlaceholder && <p className="text-xs text-slate-300 mt-1">(Placeholder)</p>}
    </>
  );
}