import { useState } from "react";
import { useParams } from "react-router-dom";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import CardBasic from "../common/CardBasic";
import ErrorPopup from "../common/ErrorPopup";
import BasicSpinner from "../common/BasicSpinner";
import toolIcon from "../assets/toolOptionIcon.svg";
import trashIcon from "../assets/trashbinIcon.svg";
import envelopeIcon from "../assets/envelope.svg";
import {
  useUserUserControllerFindUsersByConferenceId,
  useUserUserControllerCreate,
  useUserUserControllerUpdate,
  useUserUserControllerRemove,
  useUserUserControllerUploadCsv,
} from "../api/generate/hooks/UserService.hooks";
import { useEmailEmailControllerSendOneCodeByUserId } from "../api/generate/hooks/EmailService.hooks";
import type { User } from "../api/generate/models/User";

export default function ConferenceDashboardUserView() {
  const { conferenceId } = useParams<{ conferenceId: string }>();
  const conferenceIdNum = Number(conferenceId);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showCsvForm, setShowCsvForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Use hooks - passing conferenceId to get users for this specific conference
  const { data: users, isLoading } =
    useUserUserControllerFindUsersByConferenceId([conferenceIdNum], undefined);
  const createMutation = useUserUserControllerCreate();
  const updateMutation = useUserUserControllerUpdate();
  const removeMutation = useUserUserControllerRemove();
  const sendEmailMutation = useEmailEmailControllerSendOneCodeByUserId();
  const uploadCSVMutation = useUserUserControllerUploadCsv();

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
      const payload = {
        email: formData.email,
        name: formData.name,
        conferenceId: conferenceIdNum,
      };
      createMutation.mutate(payload, {
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
    if (!confirm("Diesen Benutzer wirklich löschen?")) return;
    removeMutation.mutate(id, {
      onError: (err: unknown) => {
        setError(err instanceof Error ? err.message : "Fehler beim Löschen");
      },
    });
  }

  function handleEdit(user: User, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingId(user.id);
    setFormData({
      email: user.email,
      name: user.name,
    });
    setShowForm(true);
  }

  function resetForm() {
    setFormData({ email: "", name: "" });
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function handleSendEmail(userId: number, e: React.MouseEvent) {
    e.stopPropagation();
    sendEmailMutation.mutate(userId, {
      onSuccess: () => {
        alert("Code erfolgreich gesendet!");
      },
      onError: (err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Fehler beim Senden der E-Mail"
        );
      },
    });
  }

  function sendAllEmails() {
    if (!users || users.length === 0) {
      setError("Keine Benutzer vorhanden");
      return;
    }
    if (!confirm(`Codes an alle ${users.length} Benutzer senden?`)) return;

    let successCount = 0;
    let errorCount = 0;

    users.forEach((user) => {
      sendEmailMutation.mutate(user.id, {
        onSuccess: () => {
          successCount++;
          if (successCount + errorCount === users.length) {
            alert(
              `Codes gesendet: ${successCount} erfolgreich, ${errorCount} fehlgeschlagen`
            );
          }
        },
        onError: () => {
          errorCount++;
          if (successCount + errorCount === users.length) {
            alert(
              `Codes gesendet: ${successCount} erfolgreich, ${errorCount} fehlgeschlagen`
            );
          }
        },
      });
    });
  }

  function handleCsvSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      setError("Bitte wählen Sie eine CSV-Datei aus");
      return;
    }

    uploadCSVMutation.mutate([conferenceIdNum, { file: selectedFile }], {
      onSuccess: (data) => {
        alert(`${data.length} Benutzer erfolgreich erstellt!`);
        setShowCsvForm(false);
        setSelectedFile(null);
      },
      onError: (err: unknown) => {
        setError(err instanceof Error ? err.message : "Fehler beim CSV-Upload");
      },
    });
  }

  function closeCsvForm() {
    if (selectedFile && !confirm("Änderungen verwerfen?")) return;
    setShowCsvForm(false);
    setSelectedFile(null);
    setError("");
  }

  return (
    <div className="p-4">
      <div className="mb-5">
        <div className="mt-3 max-w-lg mx-auto space-y-2">
          <div className="flex gap-4 justify-center">
            <ButtonRoundedLgPrimaryBasic
              className="w-5/8"
              onClick={() => setShowForm(true)}
            >
              Neuen Benutzer erstellen
            </ButtonRoundedLgPrimaryBasic>
            <ButtonRoundedLgPrimaryBasic
              className="w-3/8"
              onClick={() => setShowCsvForm(true)}
            >
              CSV-Upload
            </ButtonRoundedLgPrimaryBasic>
          </div>
          <ButtonRoundedLgPrimaryBasic
            className="w-full"
            onClick={sendAllEmails}
            disabled={!users || users.length === 0}
          >
            Codes an alle Benutzer senden
          </ButtonRoundedLgPrimaryBasic>
        </div>
      </div>

      {error && <ErrorPopup message={error} onClose={() => setError("")} />}

      {/* Popup Overlay */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={resetForm}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Schließen"
            >
              ×
            </button>

            <h2 className="mb-4 text-xl font-bold">
              {editingId ? "Benutzer bearbeiten" : "Neuen Benutzer erstellen"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block mb-1 font-medium">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Max Mustermann"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  E-Mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="benutzer@example.com"
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

      {/* CSV Upload Popup */}
      {showCsvForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeCsvForm}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeCsvForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Schließen"
            >
              ×
            </button>

            <h2 className="mb-4 text-xl font-bold">
              Benutzer per CSV hochladen
            </h2>

            <form onSubmit={handleCsvSubmit} className="space-y-4 text-left">
              <div>
                <label className="block mb-1 font-medium">
                  CSV-Datei <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".csv"
                  className="w-full border border-gray-300 rounded p-2"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  required
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Ausgewählt: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Format:</strong> Die CSV-Datei muss die Spalten "Name"
                  und "Email" enthalten.
                </p>
                <a
                  href="/src/assets/UserUploadTemplate.csv"
                  download="UserUploadTemplate.csv"
                  className="text-sm text-blue-600 hover:underline"
                >
                  ↓ CSV-Vorlage herunterladen
                </a>
              </div>

              <div className="flex gap-2">
                <ButtonRoundedLgPrimaryBasic
                  type="submit"
                  className="flex-1"
                  disabled={uploadCSVMutation.isPending}
                >
                  {uploadCSVMutation.isPending ? "Hochladen..." : "Hochladen"}
                </ButtonRoundedLgPrimaryBasic>
                <ButtonRoundedLgPrimaryBasic
                  type="button"
                  onClick={closeCsvForm}
                  className="flex-1"
                >
                  Abbrechen
                </ButtonRoundedLgPrimaryBasic>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Cards */}
      <div className="flex flex-wrap gap-4 justify-center">
        {isLoading ? (
          <BasicSpinner />
        ) : users && users.length > 0 ? (
          users.map((user: User) => (
            <CardBasic key={user.id} title={user.name}>
              <div className="space-y-2 text-sm text-left">
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
                {user.codeSentAt && (
                  <div>
                    <div>
                      <strong>Code gesendet am:</strong>{" "}
                    </div>
                    <div>
                      {new Date(user.codeSentAt).toLocaleString("de-DE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                      {", "}
                      {new Date(user.codeSentAt).toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" Uhr"}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4 w-full">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleEdit(user, e)}
                    aria-label="Bearbeiten"
                    className="p-2 rounded hover:bg-slate-100"
                  >
                    <img src={toolIcon} alt="Bearbeiten" className="h-8 w-8" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(user.id, e)}
                    aria-label="Löschen"
                    className="p-2 rounded hover:bg-slate-100"
                  >
                    <img src={trashIcon} alt="Löschen" className="h-8 w-8" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleSendEmail(user.id, e)}
                  aria-label="Code senden"
                  className="p-2 rounded hover:bg-slate-100"
                  title="Code per E-Mail senden"
                >
                  <img
                    src={envelopeIcon}
                    alt="E-Mail senden"
                    className="h-8 w-8"
                  />
                </button>
              </div>
            </CardBasic>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">Keine Benutzer vorhanden</p>
            <p className="text-sm mt-2">
              Erstellen Sie den ersten Benutzer mit dem Button oben
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
