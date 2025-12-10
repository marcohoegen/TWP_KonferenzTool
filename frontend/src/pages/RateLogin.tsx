import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import confeedlogo from "../assets/confeedMinimal.svg";
import InputFieldLogin from "../components/InputFieldLogin";
import ButtonLoadingAnimated from "../common/ButtonLoadingAnimated";
import ErrorPopup from "../common/ErrorPopup";
import { useUserUserControllerLogin } from "../api/generate/hooks/UserService.hooks";
import { useUserAuth } from "../contexts/UserAuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RateLogin() {
  const [userCode, setUserCode] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showUnauthorizedPopup, setShowUnauthorizedPopup] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mutation hook for login
  const loginMutation = useUserUserControllerLogin();
  const { isAuthenticated, isLoading } = useUserAuth();

  // Check for unauthorized redirect
  useEffect(() => {
    if (searchParams.get("unauthorized") === "true") {
      setShowUnauthorizedPopup(true);
      // Remove the parameter from URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Auto-dismiss unauthorized popup after 5 seconds
  useEffect(() => {
    if (showUnauthorizedPopup) {
      const timer = setTimeout(() => setShowUnauthorizedPopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showUnauthorizedPopup]);

  // Redirect to waiting room if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/rate/wait", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

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
      // Reload page to trigger auth context refresh
      window.location.href = "/rate/wait";
    } catch {
      // Always show user-friendly message regardless of backend error
      setLoginError("Invalid code. Please try again.");
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Don't render login form if already authenticated (will redirect)
  if (isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col items-center mt-12 px-4">
      <img
        src={confeedlogo}
        alt="Confeed Logo"
        className="w-[50vw] max-w-xs h-auto mx-auto"
      />
      <h2 className="text-2xl font-semibold mt-4">User Login</h2>

      <div className="flex flex-col gap-4 w-full max-w-md mt-6">
        <InputFieldLogin
          id="userCode"
          label="Persönlicher Code"
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
          className="text-sm text-sky-600 hover:underline font-medium transition-colors cursor-pointer"
        >
          Admin? Klicke hier zum Login
        </button>
      </div>

      {/* Error Popup for unauthorized access */}
      {showUnauthorizedPopup && (
        <ErrorPopup
          title="Zugriff verweigert"
          message="Bitte melden Sie sich an, um auf diese Seite zuzugreifen"
          visible={true}
          position="bottom"
          onClose={() => setShowUnauthorizedPopup(false)}
        />
      )}
    </div>
  );
}
