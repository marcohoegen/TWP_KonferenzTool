// TODO: call createRating mutation e.g. useRatingCreate({ presentationId, content, style, slides, userCode }).
// Future API integration:
// - Submit ratings via: const mutation = useRatingRatingControllerCreate()
// - On submit: await mutation.mutateAsync({ 
//     presentationId, 
//     userCode, 
//     content: ratings.content, 
//     style: ratings.style, 
//     slides: ratings.slides 
//   })
// - Handle success/error states with proper UI feedback
// Example request payload:
// {
//   "presentationId": "uuid",
//   "userCode": "ABC123",
//   "content": 4,
//   "style": 5,
//   "slides": 3
// }

import { useNavigate } from "react-router-dom";
import confeedlogo from "../assets/confeedlogo.svg";
import InputRating from "../components/InputRating";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import { useRatingContext } from "../context/RatingContext";

export default function RatePresentation() {
  const navigate = useNavigate();
  // const { presentationId } = useParams<{ presentationId: string }>();
  const { ratings, setRating } = useRatingContext();

  const handleSubmit = () => {
    // TODO: Replace with actual API call
    // const mutation = useRatingRatingControllerCreate();
    // await mutation.mutateAsync({
    //   presentationId,
    //   userCode,
    //   content: ratings.content,
    //   style: ratings.style,
    //   slides: ratings.slides,
    // });

    // For now, just navigate to thanks page
    navigate("/rate/thanks");
  };

  // Check if all ratings are filled (optional validation)
  const isComplete = ratings.content && ratings.style && ratings.slides;

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
            initialRating={ratings.content || 0}
            onRatingChange={(rating) => setRating("content", rating)}
            title="Content"
            size={48}
          />
        </div>

        {/* Style Rating */}
        <div aria-label="Style rating">
          <InputRating
            maxRating={5}
            initialRating={ratings.style || 0}
            onRatingChange={(rating) => setRating("style", rating)}
            title="Style"
            size={48}
          />
        </div>

        {/* Slides Rating */}
        <div aria-label="Slides rating">
          <InputRating
            maxRating={5}
            initialRating={ratings.slides || 0}
            onRatingChange={(rating) => setRating("slides", rating)}
            title="Slides"
            size={48}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8 w-full">
          <ButtonRoundedLgPrimaryBasic 
            onClick={handleSubmit}
            disabled={!isComplete}
          >
            Send Feedback
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
