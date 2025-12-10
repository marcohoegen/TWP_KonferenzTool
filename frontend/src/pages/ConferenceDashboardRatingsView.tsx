import { useState } from "react";
import { useParams } from "react-router-dom";
import { useRatingRatingControllerGetRanking } from "../api/generate/hooks/RatingService.hooks";
import { usePresentationPresentationControllerFindPresentationsByConferenceId } from "../api/generate/hooks/PresentationService.hooks";
import { useSessionSessionControllerFindSessionsByConferenceId } from "../api/generate/hooks/SessionService.hooks";
import { useUserUserControllerFindUsersByConferenceId } from "../api/generate/hooks/UserService.hooks";
import BasicSpinner from "../common/BasicSpinner";
import ErrorPopup from "../common/ErrorPopup";
import CardBasic from "../common/CardBasic";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import { formatNumberDE, handleExportCSV, calculateHistogramHeights } from "../helper/helper";

// Type definitions matching backend response
interface PresenterInfo {
  id: number;
  name: string;
}

interface RatingStats {
  average: number;
  min: number;
  max: number;
  median: number;
  histogram: Record<number, number>;
}

interface PresentationRanking {
  presentationId: number;
  title: string;
  presenters: PresenterInfo[];
  numberOfRatings: number;
  overallAverage: number;
  overallMedian: number;
  overallMin: number;
  overallMax: number;
  contentsRatingStats: RatingStats;
  styleRatingStats: RatingStats;
  slidesRatingStats: RatingStats;
}

type SortField =
  | "title"
  | "numberOfRatings"
  | "overallAverage";

type SortDirection = "asc" | "desc";

// Helper function to render star rating with partial fill
function renderStarRating(rating: number) {
  // Round UP to nearest 0.5: 2.01 -> 2.5, 2.51 -> 3, 2.97
  const roundedRating = Math.ceil(rating * 2) / 2;
  
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 === 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex gap-0.5">
      {/* Full stars */}
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
      {/* Half star - using visually distinctive character */}
      {hasHalfStar && (
        <span className="text-yellow-400 relative">
          <span className="absolute inset-0 overflow-hidden w-1/2">★</span>
          <span className="text-gray-300">★</span>
        </span>
      )}
      {/* Empty stars */}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">★</span>
        ))}
    </div>
  );
}

export default function ConferenceDashboardRatingsView() {
  const { conferenceId } = useParams<{ conferenceId: string }>();

  // View toggle state
  const [viewMode, setViewMode] = useState<"presentations" | "feedback">("presentations");

  // State management
  const [minRatings, setMinRatings] = useState<number>(0);
  const [appliedMinRatings, setAppliedMinRatings] = useState<number>(0);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [appliedSessionId, setAppliedSessionId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>("overallAverage");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // Fetch ranking data with applied filter
  const {
    data: rankingData,
    isLoading,
    error,
  } = useRatingRatingControllerGetRanking(
    [appliedMinRatings, conferenceId ? Number(conferenceId) : undefined], 
    {
      enabled: !!conferenceId,
    }
  );

  // Fetch presentations to get sessionId mapping
  const { data: presentations } = usePresentationPresentationControllerFindPresentationsByConferenceId(
    [Number(conferenceId)],
    { enabled: !!conferenceId }
  );

  // Fetch sessions for filter dropdown
  const { data: sessions } = useSessionSessionControllerFindSessionsByConferenceId(
    [Number(conferenceId)],
    { enabled: !!conferenceId }
  );

  // Fetch users for conference feedback
  const { data: users } = useUserUserControllerFindUsersByConferenceId(
    [Number(conferenceId)],
    { enabled: !!conferenceId && viewMode === "feedback" }
  );

  // Filter users with conference comments
  const usersWithFeedback = users?.filter(
    (user: { conferenceComment?: string | null }) => 
      user.conferenceComment && user.conferenceComment.trim().length > 0
  ) || [];

  // Parse ranking data and filter by conference
  const allRankings: PresentationRanking[] = rankingData || [];
  
  // Filter by session if selected
  const rankings: PresentationRanking[] = appliedSessionId !== null
    ? allRankings.filter(ranking => {
        const presentation = presentations?.find((p: { id: number }) => p.id === ranking.presentationId);
        return presentation?.sessionId === appliedSessionId;
      })
    : allRankings;

  // Sorting function
  const sortedRankings = [...rankings]
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle string comparison for title
      if (sortField === "title") {
        aValue = (aValue as string).toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    })
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  // Handle sort click
  function handleSort(field: SortField) {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, set default direction based on field type
      setSortField(field);
      setSortDirection(field === "overallAverage" ? "desc" : "asc");
    }
  }

  // Apply filter
  function handleApplyFilter() {
    setAppliedMinRatings(minRatings);
    setAppliedSessionId(selectedSessionId);
  }

  // Reset filter
  function handleResetFilter() {
    setMinRatings(0);
    setAppliedMinRatings(0);
    setSelectedSessionId(null);
    setAppliedSessionId(null);
  }  

  // Toggle expanded card for histogram details
  function toggleExpandCard(presentationId: number) {
    setExpandedCard(expandedCard === presentationId ? null : presentationId);
  }

  // Render histogram - display with pre-calculated heights
  function renderHistogram(histogram: Record<number, number> | undefined, histogramHeights: Record<number, number> | undefined, label: string) {
    if (!histogram || !histogramHeights || Object.keys(histogram).length === 0) return null;

    // Convert histogram object to array: [count_for_1star, count_for_2stars, ...]
    const histogramArray = [1, 2, 3, 4, 5].map(rating => histogram[rating] || 0);
    const heightsArray = [1, 2, 3, 4, 5].map(rating => histogramHeights[rating] || 0);

    return (
      <div className="mb-8">
        <h5 className="text-xs font-semibold text-slate-700 mb-2">{label}</h5>
        <div className="flex items-end justify-between gap-2 w-full" style={{ height: "120px", position: "relative", paddingTop: "20px", paddingBottom: "28px" }}>
          {histogramArray.map((count, index) => {
            const displayHeight = heightsArray[index];
            
            return (
              <div key={index} className="flex flex-col items-center flex-1 h-full" style={{ position: "relative" }}>
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-slate-600 font-semibold whitespace-nowrap">
                  {count}
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-500">
                  {index + 1}★
                </div>
                <div
                  className="w-full bg-sky-500 rounded-t transition-all"
                  style={{ 
                    height: `${displayHeight}%`,
                    minHeight: displayHeight > 0 ? "2px" : "0px",
                    position: "absolute",
                    bottom: "0",
                    left: "0"
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <BasicSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorPopup message="Fehler beim Laden der Bewertungen" />;
  }

  return (
    <div className="p-4">
      {/* View Toggle Buttons */}
      <div className="mb-5">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Ansicht wählen
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode("presentations")}
              className={`flex-1 px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                viewMode === "presentations"
                  ? "bg-sky-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Präsentationsbewertungen
            </button>
            <button
              onClick={() => setViewMode("feedback")}
              className={`flex-1 px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                viewMode === "feedback"
                  ? "bg-sky-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Konferenz-Feedback
            </button>
          </div>
        </div>
      </div>

      {/* Conditional rendering based on view mode */}
      {viewMode === "presentations" ? (
        <>
      {/* Filter Controls Section */}
      <div className="mb-5">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Filter & Export
          </h2>
          
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end gap-3">
            <div className="flex-1 min-w-full sm:min-w-[200px]">
              <label
                htmlFor="minRatings"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Mindestanzahl Bewertungen
              </label>
              <input
                id="minRatings"
                type="number"
                min="0"
                value={minRatings}
                onChange={(e) => setMinRatings(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="0"
              />
            </div>

            <div className="flex-1 min-w-full sm:min-w-[200px]">
              <label
                htmlFor="sessionFilter"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Session filtern
              </label>
              <select
                id="sessionFilter"
                value={selectedSessionId ?? ""}
                onChange={(e) => setSelectedSessionId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Alle Sessions</option>
                {sessions?.map((session: { id: number; sessionName: string; sessionNumber: number }) => (
                  <option key={session.id} value={session.id}>
                    {session.sessionName === "presentations"
                      ? "Unzugeordnete Präsentationen"
                      : `${session.sessionNumber} - ${session.sessionName}`}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:flex-1">
              <button
                onClick={handleApplyFilter}
                className="flex-1 px-6 py-2 bg-sky-500 text-white text-sm rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Filtern
              </button>
              <button
                onClick={handleResetFilter}
                className="flex-1 px-6 py-2 bg-slate-200 text-slate-700 text-sm rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors font-medium"
              >
                Zurücksetzen
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {(appliedMinRatings > 0 || appliedSessionId !== null) && (
              <p className="text-xs text-slate-600">
                Aktive Filter: 
                {appliedMinRatings > 0 && ` Mindestens ${appliedMinRatings} Bewertung${appliedMinRatings !== 1 ? "en" : ""}`}
                {appliedMinRatings > 0 && appliedSessionId !== null && ","} 
                {appliedSessionId !== null && (() => {
                  const session = sessions?.find((s: { id: number }) => s.id === appliedSessionId);
                  return session 
                    ? ` Session: ${session.sessionName === "presentations" ? "Unzugeordnete Präsentationen" : `${session.sessionNumber} - ${session.sessionName}`}`
                    : " Session ausgewählt";
                })()}
              </p>
            )}
            <div className="w-full sm:w-auto">
              <ButtonRoundedLgPrimaryBasic
                onClick={() => handleExportCSV(sortedRankings, conferenceId || "")}
                disabled={!sortedRankings.length}
                className="w-full sm:w-auto"
              >
                CSV Exportieren
              </ButtonRoundedLgPrimaryBasic>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 max-w-4xl mx-auto mt-4">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Sortierung
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSort("overallAverage")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                sortField === "overallAverage"
                  ? "bg-sky-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Gesamtbewertung {sortField === "overallAverage" && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => handleSort("numberOfRatings")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                sortField === "numberOfRatings"
                  ? "bg-sky-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Anzahl Bewertungen {sortField === "numberOfRatings" && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => handleSort("title")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                sortField === "title"
                  ? "bg-sky-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Titel {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-center mb-4 text-sm text-slate-600">
        {sortedRankings.length} Präsentation{sortedRankings.length !== 1 ? "en" : ""} gefunden
      </div>

      {/* Presentation Cards */}
      <div className="flex flex-wrap gap-4 justify-center">
        {sortedRankings.length > 0 ? (
          sortedRankings.map((item) => (
            <CardBasic key={item.presentationId} title={`#${item.rank} - ${item.title}`}>
              <div className="space-y-2 text-sm text-left">
                {/* Overall Rating - Prominent */}
                <div className="bg-sky-50 rounded-lg p-3 border border-sky-200">
                  <div className="text-center">
                    <div className="text-xs text-slate-600 mb-1">Gesamtbewertung</div>
                    <div className="text-3xl font-bold text-sky-600">
                      {formatNumberDE(item.overallAverage)}
                    </div>
                    <div className="text-sm mt-2">
                      {renderStarRating(item.overallAverage)}
                    </div>
                  </div>
                </div>

                {/* Ratings Count */}
                <div>
                  <strong>Anzahl Bewertungen:</strong> {item.numberOfRatings}
                </div>

                {/* Individual Ratings */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Inhalt:</span>
                    <span className="font-semibold text-slate-900">
                      {formatNumberDE(item.contentsRatingStats.average)} ★
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Stil:</span>
                    <span className="font-semibold text-slate-900">
                      {formatNumberDE(item.styleRatingStats.average)} ★
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Folien:</span>
                    <span className="font-semibold text-slate-900">
                      {formatNumberDE(item.slidesRatingStats.average)} ★
                    </span>
                  </div>
                </div>

                {/* Presenters */}
                {item.presenters && item.presenters.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <strong className="text-xs text-slate-600">Präsentatoren:</strong>
                    <div className="text-xs text-slate-700 mt-1">
                      {item.presenters.map((p) => p.name).join(", ")}
                    </div>
                  </div>
                )}
              </div>

              {/* Toggle Details Button */}
              <div className="mt-4 w-full">
                <button
                  onClick={() => toggleExpandCard(item.presentationId)}
                  className="w-full px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors font-medium"
                >
                  {expandedCard === item.presentationId
                    ? "Details ausblenden ▲"
                    : "Details anzeigen ▼"}
                </button>
              </div>

              {/* Expanded Details - Histograms */}
              {expandedCard === item.presentationId && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">
                    Bewertungsverteilung
                  </h4>
                  <div className="space-y-4">
                    {(() => {
                      const heights = calculateHistogramHeights(
                        item.contentsRatingStats.histogram,
                        item.styleRatingStats.histogram,
                        item.slidesRatingStats.histogram
                      );
                      return (
                        <>
                          {renderHistogram(item.contentsRatingStats.histogram, heights.contentHeights, "Inhalt")}
                          {renderHistogram(item.styleRatingStats.histogram, heights.styleHeights, "Stil")}
                          {renderHistogram(item.slidesRatingStats.histogram, heights.slidesHeights, "Folien")}
                        </>
                      );
                    })()}
                  </div>
                  
                  {/* Statistics */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h5 className="text-xs font-semibold text-slate-700 mb-2">Statistiken</h5>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-slate-600">Min</div>
                        <div className="font-semibold">{item.overallMin}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-600">Median</div>
                        <div className="font-semibold">{formatNumberDE(item.overallMedian)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-600">Max</div>
                        <div className="font-semibold">{item.overallMax}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardBasic>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 w-full">
            <p className="text-lg font-medium">Keine Präsentationen gefunden</p>
            <p className="text-sm mt-2">
              {appliedMinRatings > 0
                ? "Keine Präsentationen erfüllen die Filterkriterien"
                : "Es sind noch keine Bewertungen vorhanden"}
            </p>
          </div>
        )}
      </div>
        </>
      ) : (
        /* Conference Feedback View */
        <div>
          <div className="text-center mb-4 text-sm text-slate-600">
            {usersWithFeedback.length} Feedback{usersWithFeedback.length !== 1 ? "s" : ""} gefunden
          </div>

          {usersWithFeedback.length > 0 ? (
            <div className="flex flex-col gap-4 max-w-4xl mx-auto">
              {usersWithFeedback.map((user: { id: number; conferenceComment?: string | null }, index: number) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-slate-200"
                >
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    Konferenz-Feedback #{index + 1}
                  </h3>
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {user.conferenceComment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">Kein Feedback gefunden</p>
              <p className="text-sm mt-2">
                Es wurde noch kein Konferenz-Feedback abgegeben
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
