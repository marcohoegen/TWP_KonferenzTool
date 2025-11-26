
import { useNavigate, useParams } from "react-router-dom";
import confeedlogo from "../assets/confeedlogo.svg";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import BasicSpinner from "../common/BasicSpinner";
import { usePresentationPresentationControllerFindOne } from "../api/generate/hooks/PresentationService.hooks";
import { usePresentationStatusCheck } from "../hooks/usePresentationStatusCheck";

export default function RateOverview() {
  const navigate = useNavigate();
  const { presentationId } = useParams<{ presentationId: string }>();

  const presentationNum = presentationId ? Number(presentationId) : null;
  const { data, isLoading, error } = usePresentationPresentationControllerFindOne(
    presentationNum !== null ? [presentationNum] : undefined,
    { enabled: presentationNum !== null }
  );

  // Monitor presentation status - redirect to waiting room if it becomes inactive
  usePresentationStatusCheck(presentationId);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const presentation = data as any;

  // Extract presenter name from the presenters array (first presenter's email or fallback)
  const presenterName = presentation?.presenters?.[0]?.email || "Presenter";
  const presentationTitle = presentation?.title || "Presentation";

  const handleEnterFeedback = () => {
    if (presentationId) {
      navigate(`/rate/presentation/${presentationId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BasicSpinner />
        <p className="mt-4 text-gray-600">Loading presentation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-red-500 text-center">Failed to load presentation details.</p>
        <button 
          onClick={() => navigate("/rate/wait")}
          className="mt-4 text-sky-500 underline"
        >
          Back to waiting room
        </button>
      </div>
    );
  }

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
          {presenterName}
        </h2>
        
        <p className="text-xl text-gray-700 mb-8">
          {presentationTitle}
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
