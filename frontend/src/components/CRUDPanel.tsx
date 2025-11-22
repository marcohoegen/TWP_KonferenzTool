import React, { useState } from "react";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import CardBasic from "../common/CardBasic";
import ErrorPopup from "../common/ErrorPopup";
import BasicSpinner from "../common/BasicSpinner";
import toolIcon from "../assets/toolOptionIcon.svg";
import trashIcon from "../assets/trashbinIcon.svg";
import type { ResourceConfig } from "../config/resourceConfigs";

interface CRUDPanelProps {
  config: ResourceConfig;
}

export default function CRUDPanel({ config }: CRUDPanelProps) {
  const {
    title,
    fields,
    useFindAll,
    useCreate,
    useUpdate,
    useRemove,
    getCardTitle,
  } = config;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // helper to parse comma separated number strings into number[] (filters invalid)
  function parseNumberArrayString(value?: string) {
    if (!value) return [];
    return value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => parseInt(s, 10))
      .filter((n) => !Number.isNaN(n));
  }

  // Use the passed hooks - they expect (undefined, undefined) for query hooks
  const queryResult = useFindAll();
  const items = queryResult?.data;
  const isLoading = queryResult?.isLoading;

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const removeMutation = useRemove();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Convert data types as needed
    const processedData: Record<string, string | number | number[]> = {};
    fields.forEach((field) => {
      const value = formData[field.key];

      if (field.type === "number") {
        processedData[field.key] = parseInt(value || "0", 10);
      } else if (field.type === "numberArray") {
        processedData[field.key] = parseNumberArrayString(value);
      } else if (field.type === "date") {
        // Convert to ISO string if it's a date
        processedData[field.key] = value;
      } else {
        processedData[field.key] = value;
      }
    });

    if (editingId) {
      updateMutation.mutate([editingId, processedData], {
        onSuccess: () => {
          setFormData({});
          setEditingId(null);
          setShowForm(false);
        },
        onError: (err: Error) => {
          setError(err.message || "Fehler beim Aktualisieren");
        },
      });
    } else {
      createMutation.mutate(processedData, {
        onSuccess: () => {
          setFormData({});
          setShowForm(false);
        },
        onError: (err: Error) => {
          setError(err.message || "Fehler beim Erstellen");
        },
      });
    }
  }

  function handleDelete(id: number) {
    if (!confirm("Diesen Eintrag wirklich löschen?")) return;
    removeMutation.mutate(id, {
      onError: (err: Error) => {
        setError(err.message || "Fehler beim Löschen");
      },
    });
  }

  function handleEdit(item: Record<string, string | number | number[]>) {
    setEditingId(item.id as number);
    // Convert to strings for form inputs
    const editData: Record<string, string> = {};
    fields.forEach((field) => {
      const value = item[field.key];
      if (value !== undefined && value !== null) {
        if (field.type === "date") {
          // Format date for input type="date"
          const dateValue = new Date(value as string);
          editData[field.key] = dateValue.toISOString().split("T")[0];
        } else if (field.type === "numberArray") {
          // Convert number[] to comma separated string
          if (Array.isArray(value)) {
            editData[field.key] = (value as number[]).join(",");
          } else if (typeof value === "string") {
            editData[field.key] = value;
          } else {
            editData[field.key] = String(value);
          }
        } else {
          editData[field.key] = String(value);
        }
      }
    });
    setFormData(editData);
    setShowForm(true);
  }

  function handleCancel() {
    setFormData({});
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  const defaultCardTitle = (item: Record<string, string | number>) =>
    String(item.name || item.title || item.email || `#${item.id}`);

  return (
    <div className="p-4">
      <div className="mb-5">
        <h1 className="text-center text-2xl font-semibold">{title}</h1>
        <div className="mt-3 max-w-lg mx-auto">
          <ButtonRoundedLgPrimaryBasic
            className="w-full"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Abbrechen" : "Neu hinzufügen"}
          </ButtonRoundedLgPrimaryBasic>
        </div>
      </div>

      {error && <ErrorPopup message={error} onClose={() => setError("")} />}

      {showForm && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="mb-4 text-xl font-bold">
            {editingId ? "Bearbeiten" : "Neu erstellen"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block mb-1 font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    className="w-full border border-gray-300 rounded p-2"
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                    placeholder={field.placeholder || field.label}
                    required={field.required}
                    rows={3}
                  />
                ) : field.type === "select" && field.options ? (
                  <select
                    className="w-full border border-gray-300 rounded p-2"
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                    required={field.required}
                  >
                    <option value="">Bitte wählen...</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "numberArray" ? (
                  <div>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded p-2"
                      value={formData[field.key] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.value,
                        })
                      }
                      placeholder={field.placeholder || "z.B. 1,2,3"}
                      required={field.required}
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {parseNumberArrayString(formData[field.key]).map(
                        (n, idx) => (
                          <span
                            key={`${n}-${idx}`}
                            className="inline-flex items-center gap-2 bg-slate-100 rounded px-2 py-1 text-sm"
                          >
                            <span>{n}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const arr = parseNumberArrayString(
                                  formData[field.key]
                                );
                                const filtered = arr.filter((x) => x !== n);
                                setFormData({
                                  ...formData,
                                  [field.key]: filtered.join(","),
                                });
                              }}
                              className="text-red-500 hover:opacity-80"
                              aria-label={`Entferne ${n}`}
                            >
                              ×
                            </button>
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    className="w-full border border-gray-300 rounded p-2"
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                    placeholder={field.placeholder || field.label}
                    required={field.required}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <ButtonRoundedLgPrimaryBasic type="submit">
                {editingId ? "Aktualisieren" : "Erstellen"}
              </ButtonRoundedLgPrimaryBasic>
              <ButtonRoundedLgPrimaryBasic type="button" onClick={handleCancel}>
                Abbrechen
              </ButtonRoundedLgPrimaryBasic>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        {isLoading ? (
          <BasicSpinner />
        ) : (
          items?.map((item: Record<string, string | number>) => {
            return (
              <CardBasic
                key={item.id}
                title={
                  getCardTitle ? getCardTitle(item) : defaultCardTitle(item)
                }
              >
                <div className="space-y-2 text-sm text-left">
                  {fields.slice(0, 3).map((field) => {
                    if (field.type === "password") return null;
                    const value = item[field.key];
                    if (!value) return null;

                    let displayValue = String(value);
                    if (field.type === "date") {
                      displayValue = new Date(
                        value as string
                      ).toLocaleDateString();
                    }
                    if (field.type === "numberArray") {
                      if (Array.isArray(value)) {
                        displayValue = (value as number[]).join(", ");
                      } else {
                        displayValue = String(value);
                      }
                    }

                    return (
                      <div key={field.key}>
                        <strong>{field.label}:</strong> {displayValue}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-4 w-full">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    aria-label="Bearbeiten"
                    className="p-2 rounded hover:bg-slate-100"
                  >
                    <img src={toolIcon} alt="Bearbeiten" className="h-8 w-8" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id as number)}
                    aria-label="Löschen"
                    className="p-2 rounded hover:bg-slate-100"
                  >
                    <img src={trashIcon} alt="Löschen" className="h-8 w-8" />
                  </button>
                </div>
              </CardBasic>
            );
          })
        )}
      </div>
    </div>
  );
}
