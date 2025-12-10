import { useState } from "react";

/*
  Verwendung:
  <InputRating 
  onRatingChange={(rating) => console.log(`User rated: ${rating}`)}
  title="Wie hat dir die Konferenz gefallen?"
/>
*/

interface InputRatingProps {
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  initialRating?: number;
  title?: string;
  size?: number; // star size in pixels (mobile-optimized default)
}

export default function InputRating({
  maxRating = 5,
  onRatingChange,
  initialRating = 0,
  title = "Bewertung geben",
  size = 48, // larger for mobile touch targets
}: InputRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starIndex: number) => {
    const newRating = starIndex + 1;
    setRating(newRating);
    onRatingChange?.(newRating);
  };

  const handleStarHover = (starIndex: number) => {
    setHoverRating(starIndex + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  // Display rating: use hover if hovering, otherwise use selected rating
  const displayRating = hoverRating || rating;

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < maxRating; i++) {
      const isFilled = i < displayRating;

      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onTouchMove={(e) => {
            // mobile: detect touch position and set star
            const touch = e.touches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            const starElement = element?.closest("button");
            if (starElement) {
              const index = Array.from(starElement.parentElement?.children || []).indexOf(starElement);
              if (index >= 0) setHoverRating(index + 1);
            }
          }}
          onTouchEnd={() => {
            if (hoverRating > 0) {
              setRating(hoverRating);
              onRatingChange?.(hoverRating);
            }
          }}
          className="p-1 rounded-lg transition-transform hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label={`${i + 1} star${i !== 0 ? "s" : ""}`}
        >
          {isFilled ? (
            // Filled star
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: size, height: size }}
              className="text-amber-400 drop-shadow-sm"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            // Empty star
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              style={{ width: size, height: size }}
              className="text-amber-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          )}
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <h4 className="font-bold text-slate-700 text-lg">{title}</h4>

      {/* Stars container */}
      <div
        className="flex gap-2 sm:gap-3 justify-center"
        onMouseLeave={handleMouseLeave}
      >
        {renderStars()}
      </div>

      {/* Rating display */}
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-600">
          {rating > 0 ? (
            <>
              <span className="text-lg text-amber-500">{rating}</span>
              <span className="text-slate-400"> / {maxRating}</span>
            </>
          ) : (
            <span className="text-slate-400">Bewerte diese Kategorie</span>
          )}
        </p>
      </div>
    </div>
  );
}