import { useState } from "react";
import { useParams } from "react-router-dom";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import CardBasic from "../common/CardBasic";
import ErrorPopup from "../common/ErrorPopup";
import BasicSpinner from "../common/BasicSpinner";
import toolIcon from "../assets/toolOptionIcon.svg";
import trashIcon from "../assets/trashbinIcon.svg";
import {
  useSessionSessionControllerFindSessionsByConferenceId,
  useSessionSessionControllerCreate,
  useSessionSessionControllerUpdate,
  useSessionSessionControllerRemove,
} from "../api/generate/hooks/SessionService.hooks";
import {
  usePresentationPresentationControllerFindPresentationsByConferenceId,
  usePresentationPresentationControllerCreate,
  usePresentationPresentationControllerUpdate,
  usePresentationPresentationControllerRemove,
  usePresentationPresentationControllerUpdateStatus,
} from "../api/generate/hooks/PresentationService.hooks";
import { useUserUserControllerFindUsersByConferenceId } from "../api/generate/hooks/UserService.hooks";
import type { Presentation } from "../api/generate/models/Presentation";
import { UpdateStatusDto } from "../api/generate";
import { useConferenceConferenceControllerFindOne } from "../api/generate/hooks/ConferenceService.hooks";
import activeIcon from "../assets/activeIcon.svg";
import inactiveIcon from "../assets/inactiveIcon.svg";

// Type for Session (not exported by OpenAPI generator)
interface Session {
  id: number;
  sessionNumber: number;
  sessionName: string;
  conferenceId: number;
}

export default function ConferenceDashboardSessionView() {
  const { conferenceId } = useParams<{ conferenceId: string }>();
  const conferenceIdNum = Number(conferenceId);

  const [formData, setFormData] = useState({
    sessionName: "",
    sessionNumber: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deletePresentations, setDeletePresentations] = useState(false);
  const [editingPresentationId, setEditingPresentationId] = useState<number | null>(null);
  const [showPresentationForm, setShowPresentationForm] = useState(false);
  const [presentationFormData, setPresentationFormData] = useState({
    title: "",
    agendaPosition: "",
    sessionId: 0,
  });
  const [selectedPresenterIds, setSelectedPresenterIds] = useState<number[]>([]);

  // Fetch sessions and presentations
  const {
    data: sessions,
    isLoading: sessionsLoading,
    refetch: refetchSessions,
  } = useSessionSessionControllerFindSessionsByConferenceId(
    [conferenceIdNum],
    undefined
  );

  const {
    data: allPresentations,
    refetch: refetchPresentations,
  } = usePresentationPresentationControllerFindPresentationsByConferenceId(
    [conferenceIdNum],
    undefined
  );

  const { data: conference } = useConferenceConferenceControllerFindOne(
    [conferenceIdNum],
    undefined
  );

  // Mutations
  const createSession = useSessionSessionControllerCreate();
  const updateSession = useSessionSessionControllerUpdate();
  const deleteSession = useSessionSessionControllerRemove();
  
  // Presentation mutations
  const createPresentation = usePresentationPresentationControllerCreate();
  const updatePresentation = usePresentationPresentationControllerUpdate();
  const removePresentation = usePresentationPresentationControllerRemove();
  const updateStatusMutation = usePresentationPresentationControllerUpdateStatus();

  // Fetch users for presenter selection
  const { data: users } = useUserUserControllerFindUsersByConferenceId(
    [conferenceIdNum],
    undefined
  );

  // Validation helper
  const isReservedName = (name: string): boolean => {
    return name.trim().toLowerCase() === "presentations";
  };

  // Get presentation count for a session
  // Get presentations for a session
  const getPresentationsForSession = (sessionId: number): Presentation[] => {
    if (!allPresentations) return [];
    return allPresentations.filter((p) => p.sessionId === sessionId);
  };

  // Get default session
  const defaultSession = sessions?.find((s: Session) => s.sessionName === "presentations");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate reserved name
    if (isReservedName(formData.sessionName)) {
      setError(
        "Der Name 'presentations' ist reserviert und kann nicht verwendet werden."
      );
      return;
    }

    // Validate fields
    if (!formData.sessionName.trim() || !formData.sessionNumber) {
      setError("Bitte füllen Sie alle Felder aus.");
      return;
    }

    const sessionNumber = parseInt(formData.sessionNumber, 10);
    if (isNaN(sessionNumber) || sessionNumber < 1) {
      setError("Die Session-Nummer muss mindestens 1 sein.");
      return;
    }

    // Check for duplicate session number in the same conference (excluding current session if editing)
    const duplicateSession = sessions?.find(
      (s: Session) => 
        s.sessionNumber === sessionNumber && 
        s.id !== editingId
    );
    
    if (duplicateSession) {
      setError(
        `Die Session-Nummer ${sessionNumber} wird bereits von "${duplicateSession.sessionName}" verwendet.`
      );
      return;
    }

    try {
      if (editingId) {
        // Update existing session
        await updateSession.mutateAsync([
          editingId,
          {
            sessionName: formData.sessionName,
            sessionNumber,
          },
        ]);
      } else {
        // Create new session
        await createSession.mutateAsync([
          {
            sessionName: formData.sessionName,
            sessionNumber,
            conferenceId: conferenceIdNum,
          },
        ]);
      }

      // Reset form
      setFormData({ sessionName: "", sessionNumber: "" });
      setEditingId(null);
      setShowForm(false);
      setError("");
      refetchSessions();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Fehler beim Speichern der Session.";
      setError(errorMessage);
    }
  };

  // Handle edit
  const handleEdit = (session: Session) => {
    // Don't allow editing default session
    if (session.sessionName === "presentations") {
      setError('Die Standard-Session "Unzugeordnete Präsentationen" kann nicht bearbeitet werden.');
      return;
    }

    setEditingId(session.id);
    setFormData({
      sessionName: session.sessionName,
      sessionNumber: String(session.sessionNumber),
    });
    setShowForm(true);
    setError("");
  };

  // Handle delete
  const handleDelete = async (sessionId: number) => {
    try {
      // Delete all presentations in this session if checkbox is checked
      if (deletePresentations) {
        const presentationsToDelete = getPresentationsForSession(sessionId);
        for (const presentation of presentationsToDelete) {
          await removePresentation.mutateAsync(presentation.id);
        }
      } else {
        // If not deleting presentations, they will be moved to default session
        // We need to renumber them to follow the default session's sequence
        const presentationsToMove = getPresentationsForSession(sessionId);
        
        if (presentationsToMove.length > 0 && defaultSession) {
          // Get current max position in default session
          const defaultSessionPresentations = getPresentationsForSession(defaultSession.id);
          let nextPosition = Math.max(
            0,
            ...defaultSessionPresentations.map((p) => p.agendaPosition || 0)
          ) + 1;

          // Sort presentations to move by their current position
          const sortedPresentations = [...presentationsToMove].sort(
            (a, b) => (a.agendaPosition || 0) - (b.agendaPosition || 0)
          );

          // Update each presentation with new position before session deletion
          for (const presentation of sortedPresentations) {
            await updatePresentation.mutateAsync([
              presentation.id,
              {
                title: presentation.title,
                agendaPosition: nextPosition,
                conferenceId: conferenceIdNum,
                sessionId: presentation.sessionId ?? 0,
                presenterIds: presentation.presenters?.map((p) => p.id) || [],
              },
            ]);
            nextPosition++;
          }
        }
      }
      
      await deleteSession.mutateAsync([sessionId]);
      setDeleteConfirm(null);
      setDeletePresentations(false);
      refetchSessions();
      refetchPresentations();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Fehler beim Löschen der Session.";
      setError(errorMessage);
    }
  };

  // Presentation handlers
  const handleCreatePresentation = (sessionId: number) => {
    setPresentationFormData({
      title: "",
      agendaPosition: "",
      sessionId: sessionId,
    });
    setSelectedPresenterIds([]);
    setEditingPresentationId(null);
    setShowPresentationForm(true);
  };

  const handleEditPresentation = (presentation: Presentation) => {
    setPresentationFormData({
      title: presentation.title,
      agendaPosition: presentation.agendaPosition?.toString() || "",
      sessionId: presentation.sessionId ?? 0,
    });
    setSelectedPresenterIds(presentation.presenters?.map((p) => p.id) || []);
    setEditingPresentationId(presentation.id);
    setShowPresentationForm(true);
  };

  const handleDeletePresentation = async (presentationId: number) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diese Präsentation löschen möchten?")) {
      return;
    }
    try {
      await removePresentation.mutateAsync(presentationId);
      refetchPresentations();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Fehler beim Löschen der Präsentation.";
      setError(errorMessage);
    }
  };

  const handleStatusUpdate = async (
    presentationId: number,
    currentStatus: string
  ) => {
    const newStatus: UpdateStatusDto = {
      status:
        currentStatus === "ACTIVE"
          ? UpdateStatusDto.status.INACTIVE
          : UpdateStatusDto.status.ACTIVE,
    };
    try {
      await updateStatusMutation.mutateAsync([presentationId, newStatus]);
      refetchPresentations();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Fehler beim Aktualisieren des Status.";
      setError(errorMessage);
    }
  };

  const resetPresentationForm = () => {
    setPresentationFormData({
      title: "",
      agendaPosition: "",
      sessionId: 0,
    });
    setSelectedPresenterIds([]);
    setEditingPresentationId(null);
    setShowPresentationForm(false);
  };

  const handlePresentationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let agendaPos = presentationFormData.agendaPosition
      ? parseInt(presentationFormData.agendaPosition, 10)
      : 0;

    // Get all presentations in the target session
    const targetSessionPresentations = getPresentationsForSession(
      presentationFormData.sessionId
    );

    // Auto-adjust position if out of range (for new presentations)
    if (!editingPresentationId && agendaPos > 0) {
      const maxPosition = Math.max(
        0,
        ...targetSessionPresentations.map((p) => p.agendaPosition || 0)
      );
      
      // If user enters a position beyond max+1, set it to max+1
      if (agendaPos > maxPosition + 1) {
        agendaPos = maxPosition + 1;
      }
    }

    const data = {
      title: presentationFormData.title,
      agendaPosition: agendaPos,
      conferenceId: conferenceIdNum,
      sessionId: presentationFormData.sessionId,
      presenterIds: selectedPresenterIds,
    };

    try {
      // Check if we're creating a new presentation (not editing)
      if (!editingPresentationId && agendaPos > 0) {
        // Find if there's already a presentation with this agenda position
        const conflictingPresentation = targetSessionPresentations.find(
          (p) => p.agendaPosition === agendaPos
        );

        if (conflictingPresentation) {
          // Find the next gap or use max+1 as the stopping point
          const sortedPositions = targetSessionPresentations
            .map((p) => p.agendaPosition || 0)
            .filter((pos) => pos >= agendaPos)
            .sort((a, b) => a - b);

          // Shift only consecutive presentations starting from the conflict position
          const presentationsToShift = [];
          for (const presentation of targetSessionPresentations) {
            if (presentation.agendaPosition && presentation.agendaPosition >= agendaPos) {
              // Check if there's a gap before this position
              const hasGapBefore = sortedPositions.some((pos, idx) => {
                if (idx === 0) return false;
                return pos - sortedPositions[idx - 1] > 1 && sortedPositions[idx - 1] < (presentation.agendaPosition || 0);
              });
              
              // Only include if no gap before this position
              if (!hasGapBefore || presentation.agendaPosition === agendaPos) {
                presentationsToShift.push(presentation);
              }
            }
          }

          // Sort descending to avoid conflicts during update
          presentationsToShift.sort((a, b) => (b.agendaPosition || 0) - (a.agendaPosition || 0));

          // Update each presentation's position
          for (const presentation of presentationsToShift) {
            await updatePresentation.mutateAsync([
              presentation.id,
              {
                title: presentation.title,
                agendaPosition: (presentation.agendaPosition || 0) + 1,
                conferenceId: conferenceIdNum,
                sessionId: presentation.sessionId ?? 0,
                presenterIds: presentation.presenters?.map((p) => p.id) || [],
              },
            ]);
          }
        }
      }

      // If editing, check if position changed and handle conflicts
      if (editingPresentationId && agendaPos > 0) {
        const currentPresentation = allPresentations?.find(
          (p) => p.id === editingPresentationId
        );
        const oldPosition = currentPresentation?.agendaPosition || 0;

        if (oldPosition !== agendaPos) {
          // Find if there's already a presentation with the new position
          const conflictingPresentation = targetSessionPresentations.find(
            (p) => p.agendaPosition === agendaPos && p.id !== editingPresentationId
          );

          if (conflictingPresentation) {
            // SWAP: Give the conflicting presentation the old position
            await updatePresentation.mutateAsync([
              conflictingPresentation.id,
              {
                title: conflictingPresentation.title,
                agendaPosition: oldPosition,
                conferenceId: conferenceIdNum,
                sessionId: conflictingPresentation.sessionId ?? 0,
                presenterIds: conflictingPresentation.presenters?.map((p) => p.id) || [],
              },
            ]);
          }
        }
      }

      // Now create or update the current presentation
      if (editingPresentationId) {
        await updatePresentation.mutateAsync([editingPresentationId, data]);
      } else {
        await createPresentation.mutateAsync(data);
      }

      resetPresentationForm();
      refetchPresentations();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Fehler beim Speichern der Präsentation.";
      setError(errorMessage);
    }
  };

  // Cancel form
  const handleCancel = () => {
    setFormData({ sessionName: "", sessionNumber: "" });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  if (sessionsLoading) {
    return <BasicSpinner />;
  }

  return (
    <div className="w-full p-3 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-3">
          Sessions & Präsentationen für {conference?.name || "Konferenz"}
        </h2>
        <div className="mt-3 max-w-lg mx-auto">
          <ButtonRoundedLgPrimaryBasic onClick={() => setShowForm(true)}>
            Neue Session erstellen
          </ButtonRoundedLgPrimaryBasic>
        </div>
      </div>

      {/* Error Popup */}
      {error && (
        <ErrorPopup
          message={error}
          onClose={() => setError("")}
        />
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Session bearbeiten" : "Neue Session erstellen"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Session Name *
                </label>
                <input
                  type="text"
                  value={formData.sessionName}
                  onChange={(e) =>
                    setFormData({ ...formData, sessionName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  maxLength={100}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Session Nummer *
                </label>
                <input
                  type="number"
                  value={formData.sessionNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, sessionNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  min={1}
                  required
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={
                    !formData.sessionName.trim() ||
                    !formData.sessionNumber ||
                    isReservedName(formData.sessionName)
                  }
                  className="px-4 py-2 text-white bg-sky-500 rounded-md hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {editingId ? "Speichern" : "Erstellen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Presentation Create/Edit Modal */}
      {showPresentationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold mb-4">
              {editingPresentationId ? "Präsentation bearbeiten" : "Neue Präsentation erstellen"}
            </h2>
            <form onSubmit={handlePresentationSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Titel *
                </label>
                <input
                  type="text"
                  value={presentationFormData.title}
                  onChange={(e) =>
                    setPresentationFormData({
                      ...presentationFormData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  maxLength={200}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Agenda Position
                </label>
                <input
                  type="number"
                  value={presentationFormData.agendaPosition}
                  onChange={(e) =>
                    setPresentationFormData({
                      ...presentationFormData,
                      agendaPosition: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  min={1}
                />
              </div>

              {editingPresentationId && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Session *
                  </label>
                  <select
                    value={presentationFormData.sessionId}
                    onChange={(e) =>
                      setPresentationFormData({
                        ...presentationFormData,
                        sessionId: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  >
                    {defaultSession && (
                      <option value={defaultSession.id}>
                        Unzugeordnete Präsentationen
                      </option>
                    )}
                    {sessions
                      ?.filter((s: Session) => s.sessionName !== "presentations")
                      .sort((a: Session, b: Session) => a.sessionNumber - b.sessionNumber)
                      .map((s: Session) => (
                        <option key={s.id} value={s.id}>
                          {s.sessionNumber} - {s.sessionName}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Präsentierende
                </label>
                <div className="border border-slate-300 rounded-md p-3 max-h-48 overflow-y-auto">
                  {users?.map((user) => (
                    <label key={user.id} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPresenterIds.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPresenterIds([...selectedPresenterIds, user.id]);
                          } else {
                            setSelectedPresenterIds(
                              selectedPresenterIds.filter((id) => id !== user.id)
                            );
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{user.name}</span>
                    </label>
                  ))}
                  {(!users || users.length === 0) && (
                    <p className="text-sm text-slate-500 italic">
                      Keine Teilnehmer verfügbar
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={resetPresentationForm}
                  className="px-4 py-2 text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={!presentationFormData.title.trim()}
                  className="px-4 py-2 text-white bg-sky-500 rounded-md hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {editingPresentationId ? "Speichern" : "Erstellen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Session löschen</h2>
            <p className="mb-4">
              Diese Session wirklich löschen?
            </p>
            {defaultSession?.id !== deleteConfirm && (
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deletePresentations}
                    onChange={(e) => setDeletePresentations(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">
                    Auch alle Präsentationen in dieser Session löschen
                  </span>
                </label>
                {!deletePresentations && (
                  <p className="text-sm text-gray-600 mt-2 ml-6">
                    Präsentationen werden zu 'Unzugeordnete Präsentationen' verschoben
                  </p>
                )}
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteConfirm(null);
                  setDeletePresentations(false);
                }}
                className="px-4 py-2 text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sessions List with Nested Presentations */}
      <div className="flex flex-col gap-6">
        {/* Default Session Card */}
        {defaultSession && (
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border-2 border-slate-300">
            {/* Session Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
              <div>
                <h3 className="text-xl font-bold">Unzugeordnete Präsentationen</h3>
                <p className="text-sm text-slate-600">
                  Session Nummer: {defaultSession.sessionNumber} | {" "}
                  {getPresentationsForSession(defaultSession.id).length} Präsentationen
                </p>
                <p className="text-xs text-slate-400 italic mt-1">
                  (Standard-Session, kann nicht bearbeitet werden)
                </p>
              </div>
              <div className="w-full md:w-auto">
                <ButtonRoundedLgPrimaryBasic
                  onClick={() => handleCreatePresentation(defaultSession.id)}
                >
                  + Präsentation
                </ButtonRoundedLgPrimaryBasic>
              </div>
            </div>

            {/* Presentations Grid */}
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {getPresentationsForSession(defaultSession.id).map((presentation) => (
                <CardBasic key={presentation.id} title={presentation.title}>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-slate-600">
                      Position: {presentation.agendaPosition || "Keine"}
                    </p>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold">Präsentierende:</p>
                      {presentation.presenters && presentation.presenters.length > 0 ? (
                        presentation.presenters.map((presenter) => (
                          <p key={presenter.id} className="text-sm text-slate-600">
                            • {presenter.name}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 italic">
                          Keine Präsentierenden zugewiesen
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleStatusUpdate(presentation.id, presentation.status)}
                        className="p-2 hover:bg-slate-100 rounded"
                        title={
                          presentation.status === "ACTIVE"
                            ? "Als inaktiv markieren"
                            : "Als aktiv markieren"
                        }
                      >
                        <img
                          src={presentation.status === "ACTIVE" ? activeIcon : inactiveIcon}
                          alt={presentation.status === "ACTIVE" ? "Active" : "Inactive"}
                          className="w-5 h-5"
                        />
                      </button>
                      <button
                        onClick={() => handleEditPresentation(presentation)}
                        className="p-2 hover:bg-slate-100 rounded"
                        title="Bearbeiten"
                      >
                        <img src={toolIcon} alt="Edit" className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePresentation(presentation.id)}
                        className="p-2 hover:bg-slate-100 rounded"
                        title="Löschen"
                      >
                        <img src={trashIcon} alt="Delete" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </CardBasic>
              ))}
              {getPresentationsForSession(defaultSession.id).length === 0 && (
                <p className="text-slate-500 italic col-span-full text-center py-4">
                  Keine Präsentationen in dieser Session
                </p>
              )}
            </div>
          </div>
        )}

        {/* Other Sessions */}
        {sessions
          ?.filter((s: Session) => s.sessionName !== "presentations")
          .sort((a: Session, b: Session) => a.sessionNumber - b.sessionNumber)
          .map((session: Session) => (
            <div key={session.id} className="bg-white rounded-lg shadow-md p-4 md:p-6 border-2 border-slate-300">
              {/* Session Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                <div>
                  <h3 className="text-xl font-bold">
                    {session.sessionNumber} - {session.sessionName}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {getPresentationsForSession(session.id).length} Präsentationen
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleEdit(session)}
                    className="p-2 hover:bg-slate-100 rounded"
                    title="Session bearbeiten"
                  >
                    <img src={toolIcon} alt="Edit" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(session.id)}
                    className="p-2 hover:bg-slate-100 rounded"
                    title="Session löschen"
                  >
                    <img src={trashIcon} alt="Delete" className="w-5 h-5" />
                  </button>
                  <div className="w-full md:w-auto">
                    <ButtonRoundedLgPrimaryBasic
                      onClick={() => handleCreatePresentation(session.id)}
                    >
                      + Präsentation
                    </ButtonRoundedLgPrimaryBasic>
                  </div>
                </div>
              </div>

              {/* Presentations Grid */}
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                {getPresentationsForSession(session.id).map((presentation) => (
                  <CardBasic key={presentation.id} title={presentation.title}>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-slate-600">
                        Position: {presentation.agendaPosition || "Keine"}
                      </p>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold">Präsentierende:</p>
                        {presentation.presenters && presentation.presenters.length > 0 ? (
                          presentation.presenters.map((presenter) => (
                            <p key={presenter.id} className="text-sm text-slate-600">
                              • {presenter.name}
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 italic">
                            Keine Präsentierenden zugewiesen
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => handleStatusUpdate(presentation.id, presentation.status)}
                          className="p-2 hover:bg-slate-100 rounded"
                          title={
                            presentation.status === "ACTIVE"
                              ? "Als inaktiv markieren"
                              : "Als aktiv markieren"
                          }
                        >
                          <img
                            src={presentation.status === "ACTIVE" ? activeIcon : inactiveIcon}
                            alt={presentation.status === "ACTIVE" ? "Active" : "Inactive"}
                            className="w-5 h-5"
                          />
                        </button>
                        <button
                          onClick={() => handleEditPresentation(presentation)}
                          className="p-2 hover:bg-slate-100 rounded"
                          title="Bearbeiten"
                        >
                          <img src={toolIcon} alt="Edit" className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePresentation(presentation.id)}
                          className="p-2 hover:bg-slate-100 rounded"
                          title="Löschen"
                        >
                          <img src={trashIcon} alt="Delete" className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </CardBasic>
                ))}
                {getPresentationsForSession(session.id).length === 0 && (
                  <p className="text-slate-500 italic col-span-full text-center py-4">
                    Keine Präsentationen in dieser Session
                  </p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
