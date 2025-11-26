// API Integration: Poll presentations to detect active presentation

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confeedlogo from "../assets/confeedlogo.svg";
import BasicSpinner from "../common/BasicSpinner";
import { usePresentationPresentationControllerFindAll } from "../api/generate/hooks/PresentationService.hooks";

export default function RateWaitingRoom() {
  const navigate = useNavigate();

  // Poll presentations every 5 seconds to detect when one becomes active
  const { data: presentations } = usePresentationPresentationControllerFindAll(
    undefined,
    { refetchInterval: 5000 }
  );

  // Auto-redirect when a presentation becomes active
  useEffect(() => {
    if (!presentations) return;
    
    // Find presentation with status "ACTIVE" (enum: PresentationStatus.ACTIVE)
    // The backend returns presentations with a "status" field
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activePresentation = presentations.find((p: any) => p.status === "ACTIVE");
    
    if (activePresentation) {
      console.log("Active presentation found:", activePresentation);
      navigate(`/rate/overview/${activePresentation.id}`);
    }
  }, [presentations, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <img 
        src={confeedlogo} 
        alt="Confeed Logo" 
        className="w-[85vw] max-w-xs h-auto mx-auto mb-8" 
      />
      
      <div className="text-center">
        <p className="text-xl font-medium text-gray-700">
          Please wait until feedback opens :)
        </p>
        
        {/* Loading spinner */}
        <div className="mt-6 flex justify-center">
          <BasicSpinner />
        </div>
      </div>
    </div>
  );
}
