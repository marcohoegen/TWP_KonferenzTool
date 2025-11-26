import { useNavigate, useLocation, useParams } from "react-router-dom";
import confeedlogo from "../assets/confeedlogo.svg";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import { usePresentationStatusCheck } from "../hooks/usePresentationStatusCheck";

export default function RateThanks() {
  const navigate = useNavigate();
  const location = useLocation();
  const { presentationId: paramPresentationId } = useParams<{ presentationId: string }>();

  // Get ratings and presentationId from location.state (passed from RatePresentation)
  const ratings = location.state?.ratings;
  const presentationId = location.state?.presentationId || paramPresentationId;

  // Monitor presentation status - redirect to waiting room if it becomes inactive
  usePresentationStatusCheck(presentationId);

  const handleEdit = () => {
    // Navigate back to rating page with saved ratings via location.state
    if (presentationId) {
      navigate(`/rate/presentation/${presentationId}`, {
        state: { ratings }
      });
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

        {/* Display submitted ratings summary */}
        {ratings && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Your ratings:</p>
            <div className="flex justify-center gap-6 text-sm">
              <span>Content: {ratings.content}★</span>
              <span>Style: {ratings.style}★</span>
              <span>Slides: {ratings.slides}★</span>
            </div>
          </div>
        )}
        
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
