// TODO: Replace local verify with generated hook e.g. useAuthVerifyUserCode(userCode).
// Future API integration:
// - Call useAuthAuthControllerVerifyUserCode(userCode) to validate the code
// - On success, receive presentationId and navigate to waiting room
// - Handle error states (invalid code, network errors)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import confeedlogo from "../assets/confeedlogo.svg";
import InputFieldLogin from "../components/InputFieldLogin";
import ButtonLoadingAnimated from "../common/ButtonLoadingAnimated";
import { useRatingContext } from "../context/RatingContext";

export default function RateLogin() {
  const [userCode, setUserCode] = useState("");
  const navigate = useNavigate();
  const { setUserCode: setContextUserCode, setPresentationId } = useRatingContext();

  const handleSubmit = () => {
    // Basic validation: non-empty
    if (!userCode.trim()) {
      return;
    }

    // Store user code in context
    setContextUserCode(userCode);
    
    // TODO: Replace with actual API call to verify user code
    // const { data } = await verifyUserCodeMutation.mutateAsync({ code: userCode });
    // setPresentationId(data.presentationId);
    
    // For now, use a mock presentationId
    setPresentationId("mock-presentation-id");
    
    // Navigate to waiting room
    navigate(`/rate/wait/mock-presentation-id`);
  };

  return (
    <div className="flex flex-col items-center mt-12 px-4">
      <img 
        src={confeedlogo} 
        alt="Confeed Logo" 
        className="w-[85vw] max-w-xs h-auto mx-auto" 
      />
      <h2 className="text-xl font-semibold mt-4">User Login</h2>

      <div className="flex flex-col gap-4 w-full max-w-md mt-6">
        <InputFieldLogin
          id="userCode"
          label="Personal Code"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
        />
      </div>

      <div className="mt-6 w-full max-w-md">
        <ButtonLoadingAnimated
          text="Enter"
          loadingText="Loading..."
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}
