import { useState } from "react";
import { useNavigate } from "react-router-dom";
import confeedlogo from "../assets/confeedMinimal.svg";
import InputFieldLogin from "../components/InputFieldLogin";
import ButtonLoadingAnimated from "../common/ButtonLoadingAnimated";
import { useUserUserControllerLogin } from "../api/generate/hooks/UserService.hooks";

export default function RateLogin() {
  const [userCode, setUserCode] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Mutation hook for login
  const loginMutation = useUserUserControllerLogin();

  const handleSubmit = async () => {
    setLoginError(null);

    // Validate: exactly 5 characters
    if (userCode.trim().length !== 5) {
      setLoginError("Personal code must be exactly 5 characters");
      return;
    }

    try {
      // Use mutation hook to login
      await loginMutation.mutateAsync({ code: userCode.trim() });

      // Login successful - cookie is set by backend
      // Navigate to waiting room (no presentationId yet, will poll for active)
      navigate("/rate/wait");
    } catch {
      // Always show user-friendly message regardless of backend error
      setLoginError("Invalid code. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-12 px-4">
      <img src={confeedlogo} alt="Confeed Logo" className="w-[50vw] h-auto" />
      <h2 className="text-2xl font-semibold mt-4">User Login</h2>

      <div className="flex flex-col gap-4 w-full max-w-md mt-6">
        <InputFieldLogin
          id="userCode"
          label="Personal Code"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
        />
        {loginError && (
          <p className="text-red-500 text-sm text-center">{loginError}</p>
        )}
      </div>

      <div className="mt-6 w-full max-w-md">
        <ButtonLoadingAnimated
          text="Login"
          loadingText="Loading..."
          onClick={handleSubmit}
        />
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/admin/login")}
          className="text-sm text-gray-600 hover:text-gray-900 underline transition-colors cursor-pointer"
        >
          Admin? Click here to login
        </button>
      </div>
    </div>
  );
}
