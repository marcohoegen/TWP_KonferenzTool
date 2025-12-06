import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import CardBasic from "../common/CardBasic";
import ErrorPopup from "../common/ErrorPopup";
import BasicSpinner from "../common/BasicSpinner";
import toolIcon from "../assets/toolOptionIcon.svg";
import trashIcon from "../assets/trashbinIcon.svg";
import arrowRightIcon from "../assets/eyeIcon.svg";
import {
  useConferenceConferenceControllerFindAll,
  useConferenceConferenceControllerCreate,
  useConferenceConferenceControllerUpdate,
  useConferenceConferenceControllerRemove,
} from "../api/generate/hooks/ConferenceService.hooks";

interface Conference {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
}

export default function ConferenceCRUD() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    startDate: "",
    endDate: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Use hooks
  const { data: conferences, isLoading } =
    useConferenceConferenceControllerFindAll(undefined, undefined);
  const createMutation = useConferenceConferenceControllerCreate();
  const updateMutation = useConferenceConferenceControllerUpdate();
  const removeMutation = useConferenceConferenceControllerRemove();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (editingId) {
      updateMutation.mutate([editingId, formData], {
        onSuccess: () => {
          resetForm();
        },
        onError: (err: unknown) => {
          setError(
            err instanceof Error ? err.message : "Fehler beim Aktualisieren"
          );
        },
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          resetForm();
        },
        onError: (err: unknown) => {
          setError(
            err instanceof Error ? err.message : "Fehler beim Erstellen"
          );
        },
      });
    }
  }

  function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Diese Konferenz wirklich löschen?")) return;
    removeMutation.mutate(id, {
      onError: (err: unknown) => {
        setError(err instanceof Error ? err.message : "Fehler beim Löschen");
      },
    });
  }

  function handleEdit(conference: Conference, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingId(conference.id);
    setFormData({
      name: conference.name,
      location: conference.location,
      startDate: new Date(conference.startDate).toISOString().split("T")[0],
      endDate: new Date(conference.endDate).toISOString().split("T")[0],
    });
    setShowForm(true);
  }

  function handleView(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    navigate(`/admin/${id}/users`);
  }

  function resetForm() {
    setFormData({ name: "", location: "", startDate: "", endDate: "" });
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function closePopup() {
    if (!confirm("Änderungen verwerfen?")) return;
    resetForm();
  }

  return (
    <div className="p-4">
      <div className="mb-5">
       
        <div className="mt-3 max-w-lg mx-auto">
          <ButtonRoundedLgPrimaryBasic
            className="w-full"
            onClick={() => setShowForm(true)}
          >
            Neue Konferenz erstellen
          </ButtonRoundedLgPrimaryBasic>
        </div>
      </div>

      {error && <ErrorPopup message={error} onClose={() => setError("")} />}

      {/* Popup Overlay */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Schließen"
            >
              ×
            </button>

            <h2 className="mb-4 text-xl font-bold">
              {editingId ? "Konferenz bearbeiten" : "Neue Konferenz erstellen"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block mb-1 font-medium">
                  Konferenzname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Konferenzname"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Ort <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Ort"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Startdatum <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Enddatum <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-2">
                <ButtonRoundedLgPrimaryBasic type="submit" className="flex-1">
                  {editingId ? "Aktualisieren" : "Erstellen"}
                </ButtonRoundedLgPrimaryBasic>
                <ButtonRoundedLgPrimaryBasic
                  type="button"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Abbrechen
                </ButtonRoundedLgPrimaryBasic>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Conference Cards */}
      <div className="flex flex-wrap gap-4 justify-center">
        {isLoading ? (
          <BasicSpinner />
        ) : conferences && conferences.length > 0 ? (
          conferences.map((conference: Conference) => (
            <CardBasic key={conference.id} title={conference.name}>
              <div className="space-y-2 text-sm text-left">
                <div>
                  <strong>Ort:</strong> {conference.location}
                </div>
                <div>
                  <strong>Startdatum:</strong>{" "}
                  {new Date(conference.startDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Enddatum:</strong>{" "}
                  {new Date(conference.endDate).toLocaleDateString()}
                </div>
              </div>

              <div className="flex justify-between mt-4 w-full">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleEdit(conference, e)}
                    aria-label="Bearbeiten"
                    className="p-2 rounded hover:bg-slate-100"
                  >
                    <img src={toolIcon} alt="Bearbeiten" className="h-8 w-8" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(conference.id, e)}
                    aria-label="Löschen"
                    className="p-2 rounded hover:bg-slate-100"
                  >
                    <img src={trashIcon} alt="Löschen" className="h-8 w-8" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleView(conference.id, e)}
                  aria-label="Ansehen"
                  className="p-2 rounded hover:bg-slate-100"
                  title="Konferenz öffnen"
                >
                  <img src={arrowRightIcon} alt="Öffnen" className="h-8 w-8" />
                </button>
              </div>
            </CardBasic>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">Keine Konferenzen vorhanden</p>
            <p className="text-sm mt-2">
              Erstellen Sie Ihre erste Konferenz mit dem Button oben
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
