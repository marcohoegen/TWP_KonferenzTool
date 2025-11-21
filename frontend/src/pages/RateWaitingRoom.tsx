// TODO: Poll backend or subscribe via SSE/WebSocket to detect active presentation (replace local toggle).
// Future API integration:
// - Poll every 5-10 seconds: const { data } = usePresentationCheckActive(presentationId)
// - Or subscribe via WebSocket/SSE for real-time updates
// - When data.isActive becomes true, auto-redirect to overview
// - Example polling implementation:
//   useEffect(() => {
//     const interval = setInterval(async () => {
//       const { isActive } = await checkPresentationActive(presentationId);
//       if (isActive) navigate(`/rate/overview/${presentationId}`);
//     }, 5000); // Poll every 5 seconds
//     return () => clearInterval(interval);
//   }, [presentationId]);

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import confeedlogo from "../assets/confeedlogo.svg";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import BasicSpinner from "../common/BasicSpinner";

export default function RateWaitingRoom() {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const { presentationId } = useParams<{ presentationId: string }>();

  // Auto-redirect when presentation becomes active
  useEffect(() => {
    if (isActive && presentationId) {
      navigate(`/rate/overview/${presentationId}`);
    }
  }, [isActive, presentationId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <img 
        src={confeedlogo} 
        alt="Confeed Logo" 
        className="w-[85vw] max-w-xs h-auto mx-auto mb-8" 
      />
      
      <div className="text-center">
        <p className="text-xl font-medium text-gray-700">
          Please wait until admin opens the feedback
        </p>
        
        {/* Loading spinner */}
        <div className="mt-6 flex justify-center">
          <BasicSpinner />
        </div>
      </div>

      {/* Debug toggle button - remove in production */}
      <div className="mt-12">
        <ButtonRoundedLgPrimaryBasic 
          onClick={() => setIsActive(true)}
        >
          [Debug] Activate Presentation
        </ButtonRoundedLgPrimaryBasic>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Development toggle - remove when API is integrated
        </p>
      </div>
    </div>
  );
}
