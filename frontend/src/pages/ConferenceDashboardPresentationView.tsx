import { useState } from "react";
import { useParams } from "react-router-dom";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import CardBasic from "../common/CardBasic";
import ErrorPopup from "../common/ErrorPopup";
import BasicSpinner from "../common/BasicSpinner";
import toolIcon from "../assets/toolOptionIcon.svg";
import trashIcon from "../assets/trashbinIcon.svg";
import activeIcon from "../assets/activeIcon.svg";
import inactiveIcon from "../assets/inactiveIcon.svg";
import {
  usePresentationPresentationControllerFindPresentationsByConferenceId,
  usePresentationPresentationControllerCreate,
  usePresentationPresentationControllerUpdate,
  usePresentationPresentationControllerRemove,
  usePresentationPresentationControllerUpdateStatus,
} from "../api/generate/hooks/PresentationService.hooks";
import { useUserUserControllerFindUsersByConferenceId } from "../api/generate/hooks/UserService.hooks";
import { useSessionSessionControllerFindSessionsByConferenceId, useSessionSessionControllerFindOne } from "../api/generate/hooks/SessionService.hooks";
import type { Presentation } from "../api/generate/models/Presentation";
import { UpdateStatusDto } from "../api/generate";

export default function ConferenceDashboardPresentationView() {
  const { conferenceId, sessionId } = useParams<{ conferenceId: string; sessionId: string }>();
  const conferenceIdNum = Number(conferenceId);
  const sessionIdNum = Number(sessionId);

  const [formData, setFormData] = useState({
    title: "",
    agendaPosition: "",
    sessionId: sessionIdNum,
  });
  const [selectedPresenterIds, setSelectedPresenterIds] = useState<number[]>(
    []
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Fetch current session
  const { data: currentSession } = useSessionSessionControllerFindOne(
    [sessionIdNum],
    undefined
  );

  // Fetch all sessions for reassignment dropdown
  const { data: allSessions } = useSessionSessionControllerFindSessionsByConferenceId(
    [conferenceIdNum],
    undefined
  );

  // Use hooks - passing conferenceId to get presentations for this specific conference
  const {
    data: allPresentations,
    isLoading,
    refetch,
  } = usePresentationPresentationControllerFindPresentationsByConferenceId(
    [conferenceIdNum],
    undefined
  );

  // Filter presentations for current session
  const presentations = allPresentations?.filter(
    (p) => p.sessionId === sessionIdNum
  );

  // Fetch users for presenter selection
  const { data: users } = useUserUserControllerFindUsersByConferenceId(
    [conferenceIdNum],
    undefined
  );
  const createMutation = usePresentationPresentationControllerCreate();
  const updateMutation = usePresentationPresentationControllerUpdate();
  const removeMutation = usePresentationPresentationControllerRemove();
  const updateStatusMutation =
    usePresentationPresentationControllerUpdateStatus();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (editingId) {
      const payload = {
        title: formData.title,
        agendaPosition: parseInt(formData.agendaPosition, 10),
        presenterIds: selectedPresenterIds,
        sessionId: formData.sessionId, // Include sessionId for reassignment
      };
      updateMutation.mutate([editingId, payload], {
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
        title: formData.title,
        agendaPosition: parseInt(formData.agendaPosition, 10),
        conferenceId: conferenceIdNum,
        sessionId: sessionIdNum, // Auto-assign to current session
        presenterIds: selectedPresenterIds,
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
    if (!confirm("Diese Präsentation wirklich löschen?")) return;
    removeMutation.mutate(id, {
      onError: (err: unknown) => {
        setError(err instanceof Error ? err.message : "Fehler beim Löschen");
      },
    });
  }

  function handleEdit(presentation: Presentation, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingId(presentation.id);
    setFormData({
      title: presentation.title,
      agendaPosition: String(presentation.agendaPosition),
      sessionId: presentation.sessionId || sessionIdNum,
    });
    setSelectedPresenterIds(presentation.presenters?.map((p) => p.id) || []);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({ title: "", agendaPosition: "", sessionId: sessionIdNum });
    setSelectedPresenterIds([]);
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function handleStatusUpdate(presentationId: number, e: React.MouseEvent) {
    e.stopPropagation();

    const currentStatus = presentations?.find(
      (p) => p.id === presentationId
    )?.status;
    const newStatus =
      currentStatus === UpdateStatusDto.status.ACTIVE
        ? UpdateStatusDto.status.INACTIVE
        : UpdateStatusDto.status.ACTIVE;

    updateStatusMutation.mutate([presentationId, { status: newStatus }], {
      onSuccess: () => {
        // Refetch presentations to get updated statuses from backend
        refetch();
      },
      onError: (err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Fehler beim Statusupdate"
        );
      },
    });
  }

  return (
    <div className="p-4">
      <div className="mb-5">
        <h1 className="text-lg md:text-xl font-bold text-slate-800 mb-3">
          {currentSession?.sessionName === "presentations" 
            ? "Unzugeordnete Präsentationen" 
            : `${currentSession?.sessionNumber} - ${currentSession?.sessionName}`}
        </h1>
        <div className="mt-3 max-w-lg mx-auto">
          <ButtonRoundedLgPrimaryBasic
            className="w-full"
            onClick={() => setShowForm(true)}
          >
            Neue Präsentation erstellen
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
              {editingId
                ? "Präsentation bearbeiten"
                : "Neue Präsentation erstellen"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block mb-1 font-medium">
                  Titel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Präsentationstitel"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Agenda Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.agendaPosition}
                  onChange={(e) =>
                    setFormData({ ...formData, agendaPosition: e.target.value })
                  }
                  placeholder={
                    presentations && presentations.length > 0
                      ? String(
                          Math.max(
                            ...presentations.map((p) => p.agendaPosition)
                          ) + 1
                        )
                      : "1"
                  }
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Präsentatoren</label>
                <select
                  multiple
                  className="w-full border border-gray-300 rounded p-2"
                  value={selectedPresenterIds.map(String)}
                  onChange={(e) => {
                    const selected = Array.from(
                      e.target.selectedOptions,
                      (option) => Number(option.value)
                    );
                    setSelectedPresenterIds(selected);
                  }}
                  size={Math.min((users?.length || 0) + 1, 5)}
                >
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <option key={user.id} value={user.id} title={user.email}>
                        {user.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Keine Benutzer verfügbar</option>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1 invisible md:visible">
                  Halten Sie Strg/Cmd gedrückt, um mehrere auszuwählen
                </p>
              </div>

              {/* Session Dropdown - only show in edit mode */}
              {editingId && (
                <div>
                  <label className="block mb-1 font-medium">
                    Session zuweisen
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded p-2"
                    value={formData.sessionId}
                    onChange={(e) =>
                      setFormData({ ...formData, sessionId: Number(e.target.value) })
                    }
                  >
                    {allSessions?.map((session: { id: number; sessionName: string; sessionNumber: number }) => (
                      <option key={session.id} value={session.id}>
                        {session.sessionName === "presentations"
                          ? "Unzugeordnete Präsentationen"
                          : `${session.sessionNumber} - ${session.sessionName}`}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Wählen Sie eine andere Session, um die Präsentation zu verschieben
                  </p>
                </div>
              )}

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

      {/* Presentation Cards */}
      <div className="flex flex-wrap gap-4 justify-center">
        {isLoading ? (
          <BasicSpinner />
        ) : presentations && presentations.length > 0 ? (
          presentations.map((presentation: Presentation) => (
            <CardBasic key={presentation.id} title={presentation.title}>
              <div className="space-y-2 text-sm text-left">
                <div>
                  <strong>Agenda Position:</strong>{" "}
                  {presentation.agendaPosition}
                </div>
                {presentation.presenters &&
                  presentation.presenters.length > 0 && (
                    <div>
                      <strong>Präsentatoren:</strong>{" "}
                      {presentation.presenters.map((p) => p.name).join(", ")}
                    </div>
                  )}
              </div>

              <div className="flex justify-between mt-4 w-full">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleEdit(presentation, e)}
                    aria-label="Bearbeiten"
                    className="p-2 rounded hover:bg-slate-100"
                  >
                    <img src={toolIcon} alt="Bearbeiten" className="h-8 w-8" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(presentation.id, e)}
                    aria-label="Löschen"
                    className="p-2 rounded hover:bg-slate-100"
                  >
                    <img src={trashIcon} alt="Löschen" className="h-8 w-8" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleStatusUpdate(presentation.id, e)}
                  aria-label={
                    presentation.status === UpdateStatusDto.status.ACTIVE
                      ? "Active - Click to Deactivate"
                      : "Inactive - Click to Activate"
                  }
                  className="p-2 rounded hover:bg-slate-100"
                  title={
                    presentation.status === UpdateStatusDto.status.ACTIVE
                      ? "Active - Click to Deactivate"
                      : "Inactive - Click to Activate"
                  }
                >
                  <img
                    src={
                      presentation.status === UpdateStatusDto.status.ACTIVE
                        ? activeIcon
                        : inactiveIcon
                    }
                    alt={
                      presentation.status === UpdateStatusDto.status.ACTIVE
                        ? "Active"
                        : "Inactive"
                    }
                    className="h-8 w-8"
                  />
                </button>
              </div>
            </CardBasic>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">
              Keine Präsentationen vorhanden
            </p>
            <p className="text-sm mt-2">
              Erstellen Sie die erste Präsentation mit dem Button oben
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
