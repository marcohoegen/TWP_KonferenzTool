import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePresentationPresentationControllerFindOne } from "../api/generate/hooks/PresentationService.hooks";

/**
 * Hook that monitors a presentation's status and redirects to waiting room if it becomes INACTIVE
 * Checks every 5 seconds
 * @param presentationId
 */
export function usePresentationStatusCheck(presentationId: string | undefined) {
  const navigate = useNavigate();
  const presentationNum = presentationId ? Number(presentationId) : null;
  const hasNavigatedRef = useRef(false); // Prevent duplicate navigation

  // Poll presentation status every 5 seconds
  const { data: presentation } = usePresentationPresentationControllerFindOne(
    presentationNum !== null ? [presentationNum] : undefined,
    { 
      enabled: presentationNum !== null,
      refetchInterval: 5000 
    }
  );

  // Redirect to waiting room if presentation becomes inactive
  useEffect(() => {
    if (!presentation || hasNavigatedRef.current) return;

    const status = (presentation as { status?: string }).status;
    if (status === "INACTIVE") {
      console.log("Presentation became inactive, redirecting to waiting room");
      hasNavigatedRef.current = true;
      navigate("/rate/wait");
    }
  }, [presentation, navigate]);
}
