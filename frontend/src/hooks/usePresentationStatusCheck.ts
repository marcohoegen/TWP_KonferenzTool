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

    const isEnabled = presentationNum !== null && presentationNum !== undefined;
  // Poll presentation status every 5 seconds if enabled
  const { data: presentation } = usePresentationPresentationControllerFindOne(
    isEnabled ? [presentationNum] : undefined,
    { 
      enabled: isEnabled,
      ...(isEnabled && { refetchInterval: 5000 })
    }
  );

  // Redirect to waiting room if presentation becomes inactive
  useEffect(() => {
    if (!presentation || hasNavigatedRef.current) return;

    const status = (presentation as { status?: string }).status;
    if (status === "INACTIVE") {
      hasNavigatedRef.current = true;
      navigate("/rate/wait");
    }
  }, [presentation, navigate]);
}
