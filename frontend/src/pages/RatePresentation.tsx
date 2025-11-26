// API Integration: Submit ratings to POST /rating endpoint

import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import confeedlogo from "../assets/confeedlogo.svg";
import InputRating from "../components/InputRating";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import { RatingService } from "../api/generate/services/RatingService";
import { UserService } from "../api/generate/services/UserService";
import { useMutation } from "@tanstack/react-query";
import { usePresentationStatusCheck } from "../hooks/usePresentationStatusCheck";

interface RatingsState {
  content: number;
  style: number;
  slides: number;
}

export default function RatePresentation() {
  const navigate = useNavigate();
  const { presentationId } = useParams<{ presentationId: string }>();
  const location = useLocation();

  // Local state for ratings - initialize from location.state if coming from Edit
  const [ratings, setRatings] = useState<RatingsState>({
    content: location.state?.ratings?.content || 0,
    style: location.state?.ratings?.style || 0,
    slides: location.state?.ratings?.slides || 0,
  });
  const [error, setError] = useState<string | null>(null);

  // Monitor presentation status - redirect to waiting room if it becomes inactive
  usePresentationStatusCheck(presentationId);

  // Mutation hook for creating ratings using RatingService
  // Note: Using unknown for data type due to mismatch between backend DTO and generated model
  const createRatingMutation = useMutation({
    mutationFn: (data: unknown) => RatingService.ratingControllerCreate(data as Parameters<typeof RatingService.ratingControllerCreate>[0]),
  });

  // Update ratings if location.state changes (coming from Edit)
  useEffect(() => {
    if (location.state?.ratings) {
      setRatings(location.state.ratings);
    }
  }, [location.state?.ratings]);

  const setRating = (category: keyof RatingsState, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    
    if (!presentationId) {
      setError("No presentation selected");
      return;
    }

    // Validate all ratings are filled
    if (!ratings.content || !ratings.style || !ratings.slides) {
      setError("Please rate all categories before submitting");
      return;
    }

    try {
      // Get the authenticated user's ID from service method
      const user = (await UserService.userControllerMe()) as { id?: number };
      
      if (!user?.id) {
        setError("Unable to get user information. Please log in again.");
        return;
      }

      // Check if rating already exists for this user and presentation
      const existingRatings = await RatingService.ratingControllerFindAll();
      const existingRating = existingRatings.find(
        (r: { userId: number; presentationId: number }) => 
          r.userId === user.id && r.presentationId === Number(presentationId)
      );

      if (existingRating) {
        // Update existing rating
        await RatingService.ratingControllerUpdate(
          (existingRating as { id: number }).id,
          {
            contentsRating: ratings.content,
            styleRating: ratings.style,
            slidesRating: ratings.slides,
          }
        );
      } else {
        // Create new rating
        await createRatingMutation.mutateAsync({
          presentationId: Number(presentationId),
          contentsRating: ratings.content,
          styleRating: ratings.style,
          slidesRating: ratings.slides,
          userId: user.id,
        });
      }

      // Navigate to thanks page with ratings for Edit flow
      navigate("/rate/thanks", { 
        state: { 
          ratings, 
          presentationId,
          userId: user.id 
        } 
      });
    } catch (err: unknown) {
      const error = err as { body?: { message?: string } };
      setError(error?.body?.message || "Failed to submit rating");
    }
  };

  // Check if all ratings are filled
  const isComplete = ratings.content > 0 && ratings.style > 0 && ratings.slides > 0;
  const isSubmitting = createRatingMutation.isPending;

  return (
    <div className="flex flex-col items-center mt-12 px-4 pb-12">
      <img 
        src={confeedlogo} 
        alt="Confeed Logo" 
        className="w-[85vw] max-w-xs h-auto mx-auto mb-8" 
      />
      
      <div className="w-full max-w-md space-y-8">
        {/* Content Rating */}
        <div aria-label="Content rating">
          <InputRating
            maxRating={5}
            initialRating={ratings.content}
            onRatingChange={(rating) => setRating("content", rating)}
            title="Content"
            size={48}
          />
        </div>

        {/* Style Rating */}
        <div aria-label="Style rating">
          <InputRating
            maxRating={5}
            initialRating={ratings.style}
            onRatingChange={(rating) => setRating("style", rating)}
            title="Style"
            size={48}
          />
        </div>

        {/* Slides Rating */}
        <div aria-label="Slides rating">
          <InputRating
            maxRating={5}
            initialRating={ratings.slides}
            onRatingChange={(rating) => setRating("slides", rating)}
            title="Slides"
            size={48}
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Submit Button */}
        <div className="mt-8 w-full">
          <ButtonRoundedLgPrimaryBasic 
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Feedback"}
          </ButtonRoundedLgPrimaryBasic>
          
          {!isComplete && (
            <p className="text-sm text-gray-500 text-center mt-2">
              Please rate all categories before submitting
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
