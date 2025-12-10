{
  /* Verwendung:
    
backend sollte angeben: {
  "averageRating": 4.3,
  "totalRatings": 147,
  "breakdown": [112, 17, 12, 2, 4]
}

anwendung: 
mit hook (presentationId):
<RatingDetailed presentationId={123} minRatings={1} />

ohne api, statisch:
<RatingDetailed
  averageRating={4.2}
  totalRatings={58}
  ratingBreakdown={[40, 10, 5, 2, 1]}
/>

*/
}

import { useRef } from "react";
import { useRatingRatingControllerFindStatsByPresentationId } from "../api/generate/hooks/RatingService.hooks";

interface RatingDetailedProps {
  /** Presentation ID zum Laden der Bewertungen */
  presentationId?: number;
  /** Minimum number of ratings required */
  minRatings?: number;
  /** Optional: direkt übergebene Bewertung (z. B. aus Props) */
  averageRating?: number;
  /** Optional: Gesamtzahl der Bewertungen */
  totalRatings?: number;
  /** Optional: detaillierte Verteilung [5,4,3,2,1] */
  ratingBreakdown?: number[];
}

interface RatingData {
  averageRating: number;
  totalRatings: number;
  breakdown: number[]; // [5, 4, 3, 2, 1]
}

export default function RatingDetailed({
  presentationId,
  minRatings = 1,
  averageRating,
  totalRatings,
  ratingBreakdown,
}: RatingDetailedProps) {
  const instanceIdRef = useRef(Math.random().toString(36).slice(2, 9));

  // Use hook to fetch data if presentationId is provided
  const {
    data: apiData,
    isLoading,
    error: apiError,
  } = useRatingRatingControllerFindStatsByPresentationId(
    presentationId !== undefined ? [presentationId, minRatings] : undefined,
    {
      enabled: presentationId !== undefined && averageRating === undefined,
    }
  );

  // Determine data source
  let data: RatingData | null = null;
  let loading = false;
  let error: string | null = null;

  if (typeof averageRating === "number") {
    // Static data provided
    data = {
      averageRating,
      totalRatings: totalRatings ?? 0,
      breakdown: ratingBreakdown ?? [0, 0, 0, 0, 0],
    };
  } else if (presentationId !== undefined) {
    // API data from hook
    loading = isLoading;
    if (apiError) {
      error =
        apiError instanceof Error
          ? apiError.message
          : "Fehler beim Laden der Bewertungen";
    } else if (apiData) {
      data = {
        averageRating: apiData.averageRating ?? 0,
        totalRatings: apiData.totalRatings ?? 0,
        breakdown: apiData.breakdown ?? [0, 0, 0, 0, 0],
      };
    }
  }

  if (loading) {
    return (
      <div className="rounded bg-white p-6 text-center text-slate-400 shadow">
        Lädt Bewertungen ...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded bg-white p-6 text-center text-red-500 shadow">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded bg-white p-6 text-center text-slate-400 shadow">
        Keine Bewertungen vorhanden
      </div>
    );
  }

  const { averageRating: avg, totalRatings: total, breakdown } = data;

  // --- Sterne-Rendering mit Halbsternen ---
  const renderStars = (rating: number) => {
    const stars = [];
    const gradientId = `halfGradient-${instanceIdRef.current}`;

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        // voller Stern
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 text-amber-400"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
        );
      } else if (rating > i - 1 && rating < i) {
        // halber Stern
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-6 w-6 text-amber-400"
          >
            <defs>
              <linearGradient id={`${gradientId}-${i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#${gradientId}-${i})`}
              stroke="currentColor"
              strokeWidth="0.5"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            />
          </svg>
        );
      } else {
        // leerer Stern
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6 text-amber-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        );
      }
    }
    return stars;
  };

  // Berechne die Prozentwerte für die Progressbars
  const sum = breakdown.reduce((a, b) => a + b, 0);
  const percentages = breakdown.map((count) =>
    sum ? Math.round((count / sum) * 100) : 0
  );

  return (
    <div className="overflow-hidden rounded bg-white text-slate-500 shadow-md shadow-slate-200">
      <div className="p-6 flex flex-col items-center gap-2">
        <h4 className="font-bold text-slate-700">Customer Reviews</h4>

        <div className="flex items-center gap-3">
          <div className="flex">{renderStars(avg)}</div>
          <span className="text-sm text-slate-600">{avg.toFixed(1)} / 5</span>
        </div>

        <span className="text-xs text-slate-400">
          based on {total} user ratings
        </span>

        {/* Detailbalken */}
        <div className="flex w-full flex-col gap-3 pt-6">
          {[5, 4, 3, 2, 1].map((stars, i) => (
            <div key={stars} className="flex w-full items-center gap-2">
              <label
                htmlFor={`progress-${stars}-${instanceIdRef.current}`}
                className="w-9 text-center text-xs text-slate-500"
              >
                {stars}★
              </label>
              <progress
                id={`progress-${stars}-${instanceIdRef.current}`}
                max="100"
                value={percentages[5 - stars]}
                className="block h-3 w-full overflow-hidden rounded bg-slate-100 [&::-webkit-progress-value]:bg-amber-400"
              >
                {percentages[5 - stars]}%
              </progress>
              <span className="w-9 text-xs font-bold text-slate-700">
                {breakdown[5 - stars]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
