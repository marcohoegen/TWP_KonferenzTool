// TODO: load saved votes via useRatingFindByUserOrPresentation(...) and set context.
// Future API integration:
// - On mount, fetch saved ratings: const { data } = useRatingRatingControllerFindByUserOrPresentation({ userCode, presentationId })
// - Populate context with saved values: setRating("content", data.content), etc.
// - This allows the Edit button to show previously submitted ratings
// Example API response:
// {
//   "id": "uuid",
//   "presentationId": "uuid",
//   "userCode": "ABC123",
//   "content": 4,
//   "style": 5,
//   "slides": 3,
//   "createdAt": "2025-11-21T10:30:00Z"
// }

import { useNavigate } from "react-router-dom";
import confeedlogo from "../assets/confeedlogo.svg";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import { useRatingContext } from "../context/RatingContext";

export default function RateThanks() {
  const navigate = useNavigate();
  const { presentationId } = useRatingContext();

  const handleEdit = () => {
    // Navigate back to rating page with preserved state
    if (presentationId) {
      navigate(`/rate/presentation/${presentationId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <img 
        src={confeedlogo} 
        alt="Confeed Logo" 
        className="w-[85vw] max-w-xs h-auto mx-auto mb-8" 
      />
      
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Thanks for Voting
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Your feedback has been recorded and will help improve future presentations.
        </p>
        
        <div className="w-full">
          <ButtonRoundedLgPrimaryBasic onClick={handleEdit}>
            Edit
          </ButtonRoundedLgPrimaryBasic>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          Click Edit to modify your ratings
        </p>
      </div>
    </div>
  );
}
