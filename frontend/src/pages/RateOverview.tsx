// TODO: Use presentation fetch hook e.g. usePresentationFindOne(presentationId).
// Future API integration:
// - Fetch presentation data: const { data } = usePresentationPresentationControllerFindOne(presentationId)
// - Display real presenter name from data.presenterName
// - Display real topic from data.title or data.topic
// - Check if rating is already released/active: if (data.ratingReleased) navigate to rating page
// Example API response shape:
// {
//   "id": "uuid",
//   "presenterName": "Jane Doe",
//   "title": "How to TWP",
//   "isActive": true,
//   "ratingReleased": true
// }

import { useNavigate, useParams } from "react-router-dom";
import confeedlogo from "../assets/confeedlogo.svg";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import { useRatingContext } from "../context/RatingContext";

export default function RateOverview() {
  const navigate = useNavigate();
  const { presentationId } = useParams<{ presentationId: string }>();
  const { presenterName, presentationTopic } = useRatingContext();

  // TODO: Fetch presentation data from backend
  // useEffect(() => {
  //   const fetchPresentation = async () => {
  //     const { data } = await usePresentationFindOne(presentationId);
  //     setPresenterInfo({ name: data.presenterName, topic: data.title });
  //   };
  //   fetchPresentation();
  // }, [presentationId]);

  // For now, use placeholder data if not set
  const displayPresenterName = presenterName || "Presenter Name";
  const displayTopic = presentationTopic || "Presentation Topic";

  const handleEnterFeedback = () => {
    if (presentationId) {
      navigate(`/rate/presentation/${presentationId}`);
    }
  };

  return (
    <div className="flex flex-col items-center mt-12 px-4">
      <img 
        src={confeedlogo} 
        alt="Confeed Logo" 
        className="w-[85vw] max-w-xs h-auto mx-auto mb-8" 
      />
      
      <div className="text-center max-w-md">
        <p className="text-lg font-medium text-gray-700 mb-4">
          now voting for:
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {displayPresenterName}
        </h2>
        
        <p className="text-xl text-gray-700 mb-8">
          {displayTopic}
        </p>
        
        <div className="w-full">
          <ButtonRoundedLgPrimaryBasic onClick={handleEnterFeedback}>
            Enter Feedback
          </ButtonRoundedLgPrimaryBasic>
        </div>
      </div>
    </div>
  );
}
