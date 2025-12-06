// API Integration: Poll presentations to detect active presentations

import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import confeedMinimal from "../assets/confeedMinimal.svg";
import BasicSpinner from "../common/BasicSpinner";
import CardBasic from "../common/CardBasic";
import InputTextarea from "../common/InputTextarea";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import { usePresentationPresentationControllerFindAll } from "../api/generate/hooks/PresentationService.hooks";
import { useRatingRatingControllerFindAll } from "../api/generate/hooks/RatingService.hooks";
import { useUserUserControllerMe, useUserUserControllerUpdateComment } from "../api/generate/hooks/UserService.hooks";
import type { Presentation } from "../api/generate";

export default function RateWaitingRoom() {
  const navigate = useNavigate();
  const [generalFeedback, setGeneralFeedback] = useState("");

  // Poll presentations every 5 seconds to get updated active presentations
  const { data: presentations, isLoading } = usePresentationPresentationControllerFindAll(
    undefined,
    { refetchInterval: 5000 }
  );

  // Get current user and their ratings
  const { data: currentUser } = useUserUserControllerMe(undefined, undefined);
  const { data: allRatings } = useRatingRatingControllerFindAll(undefined, undefined);
  const updateCommentMutation = useUserUserControllerUpdateComment();

  // Filter active presentations
  const activePresentations = (presentations as Presentation[] | undefined)?.filter(
    (p) => p.status === "ACTIVE"
  ) || [];

  const handleSubmitFeedback = () => {
    const user = currentUser as { id?: number };
    if (!user?.id) {
      alert("Bitte melden Sie sich an, um Feedback abzugeben");
      return;
    }

    updateCommentMutation.mutate(
      [user.id, { conferenceComment: generalFeedback }],
      {
        onSuccess: () => {
          alert("Feedback erfolgreich gespeichert!");
          setGeneralFeedback("");
        },
        onError: (error) => {
          console.error("Error submitting feedback:", error);
          alert("Fehler beim Speichern des Feedbacks");
        },
      }
    );
  };

  // Helper function to check if user has rated a presentation
  const hasRatedPresentation = (presentationId: number): boolean => {
    const user = currentUser as { id?: number };
    if (!user?.id || !allRatings) return false;
    return allRatings.some(
      (rating) => rating.userId === user.id && rating.presentationId === presentationId
    );
  };

  const handleNavigateToPresentation = (presentationId: number) => {
    navigate(`/rate/overview/${presentationId}`);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center px-4 py-8 overflow-y-auto">
      <img
        src={confeedMinimal}
        alt="Confeed Logo"
        className="w-[85vw] max-w-xs h-auto mx-auto mb-8"
      />

      {/* General Feedback Section - Always visible */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Allgemeines Feedback
        </h2>
        <InputTextarea
          id="general-feedback"
          label="Ihr allgemeines Feedback zur Konferenz"
          placeholder="Teilen Sie uns Ihre Gedanken mit..."
          rows={4}
          resizable={true}
          value={generalFeedback}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setGeneralFeedback(e.target.value)}
        />
        <div className="mt-4">
          <ButtonRoundedLgPrimaryBasic 
            onClick={handleSubmitFeedback}
            disabled={!generalFeedback.trim()}
          >
            Feedback absenden
          </ButtonRoundedLgPrimaryBasic>
        </div>
      </div>

      {/* Active Presentations Section */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Aktive Präsentationen
        </h2>

        {isLoading ? (
          <div className="text-center">
            <BasicSpinner />
            <p className="mt-4 text-gray-600">Lade Präsentationen...</p>
          </div>
        ) : activePresentations.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-center">
            {activePresentations.map((presentation) => {
              const hasRated = hasRatedPresentation(presentation.id);
              return (
                <CardBasic key={presentation.id} title={presentation.title}>
                  <div className="space-y-2 text-sm text-left">
                    <div>
                      <strong>Agenda Position:</strong> {presentation.agendaPosition}
                    </div>
                    {presentation.presenters && presentation.presenters.length > 0 && (
                      <div>
                        <strong>Präsentatoren:</strong>{" "}
                        {presentation.presenters.map((p) => p.name).join(", ")}
                      </div>
                    )}
                    
                    {/* Rating Status */}
                    <div className={`mt-2 text-sm font-medium ${
                      hasRated ? "text-green-600" : "text-red-600"
                    }`}>
                      {hasRated 
                        ? "✓ Sie haben diese Präsentation schon bewertet" 
                        : "✗ Sie haben diese Präsentation noch nicht bewertet"
                      }
                    </div>
                  </div>

                  <div className="mt-4 w-full">
                    <ButtonRoundedLgPrimaryBasic
                      onClick={() => handleNavigateToPresentation(presentation.id)}
                    >
                      Bewertung abgeben
                    </ButtonRoundedLgPrimaryBasic>
                  </div>
                </CardBasic>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg font-medium text-gray-700 mb-4">
              Please wait until feedback opens :)
            </p>
            <BasicSpinner />
            <p className="mt-4 text-sm text-gray-500">
              Aktuell sind keine Präsentationen zur Bewertung verfügbar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
