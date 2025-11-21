import { createContext, useContext, useState, type ReactNode } from "react";

// TODO: Future backend integration
// When backend is ready, replace local state with API calls:
// - Fetch presentation data via usePresentationPresentationControllerFindOne(presentationId)
// - Submit ratings via useRatingRatingControllerCreate({ presentationId, userCode, content, style, slides })
// - Load saved ratings via useRatingRatingControllerFindByUserOrPresentation()
// - Verify user code via useAuthAuthControllerVerifyUserCode(userCode)

interface RatingState {
  userCode?: string;
  presentationId?: string;
  presenterName?: string;
  presentationTopic?: string;
  ratings: {
    content?: number;
    style?: number;
    slides?: number;
  };
}

interface RatingContextType extends RatingState {
  setUserCode: (code: string) => void;
  setPresentationId: (id: string) => void;
  setPresenterInfo: (info: { name: string; topic: string }) => void;
  setRating: (category: "content" | "style" | "slides", value: number) => void;
  clearRatings: () => void;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export function RatingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RatingState>({
    ratings: {},
  });

  const setUserCode = (code: string) => {
    setState((prev) => ({ ...prev, userCode: code }));
  };

  const setPresentationId = (id: string) => {
    setState((prev) => ({ ...prev, presentationId: id }));
  };

  const setPresenterInfo = (info: { name: string; topic: string }) => {
    setState((prev) => ({
      ...prev,
      presenterName: info.name,
      presentationTopic: info.topic,
    }));
  };

  const setRating = (
    category: "content" | "style" | "slides",
    value: number
  ) => {
    setState((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [category]: value },
    }));
  };

  const clearRatings = () => {
    setState({
      ratings: {},
    });
  };

  return (
    <RatingContext.Provider
      value={{
        ...state,
        setUserCode,
        setPresentationId,
        setPresenterInfo,
        setRating,
        clearRatings,
      }}
    >
      {children}
    </RatingContext.Provider>
  );
}

export function useRatingContext() {
  const context = useContext(RatingContext);
  if (context === undefined) {
    throw new Error("useRatingContext must be used within a RatingProvider");
  }
  return context;
}
