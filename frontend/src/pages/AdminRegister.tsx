import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputFieldLogin from "../components/InputFieldLogin";
import InputFieldPassword from "../common/InputFieldPassword";
import confeedlogo from "../assets/confeedMinimal.svg";
import ErrorPopup from "../common/ErrorPopup";
import ButtonLoadingAnimated from "../common/ButtonLoadingAnimated";
import { useAdminAdminControllerCreate } from "../api/generate/hooks/AdminService.hooks";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const createMutation = useAdminAdminControllerCreate();
  const { isAuthenticated, isLoading } = useAdminAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        navigate("/admin/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleRegister = async () => {
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("Bitte geben Sie einen Namen ein");
      return;
    }

    if (!email.trim()) {
      setError("Bitte geben Sie eine E-Mail ein");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Bitte geben Sie eine gültige E-Mail ein");
      return;
    }

    if (!password) {
      setError("Bitte geben Sie ein Passwort ein");
      return;
    }

    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name,
        email,
        password,
      });
      setSuccess(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.";
      setError(message);
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Don't render registration form if already authenticated (will redirect)
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
      <h2 className="text-2xl font-semibold mt-4">Admin-Registrierung</h2>

      <div className="flex flex-col gap-4 w-full max-w-md mt-6">
        <InputFieldLogin
          id="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputFieldLogin
          id="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputFieldPassword
          id="password"
          label="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputFieldPassword
          id="confirmPassword"
          label="Passwort wiederholen"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className="mt-6 w-full max-w-md">
        <ButtonLoadingAnimated
          text="Registrieren"
          loadingText="Wird registriert..."
          onClick={handleRegister}
        />
      </div>

      <div className="mt-4 w-full max-w-md">
        <button
          onClick={() => navigate("/admin/login")}
          className="w-full py-2 px-4 rounded bg-transparent hover:bg-transparent text-sky-600 hover:underline font-medium transition"
        >
          Zurück zum Login
        </button>
      </div>

      {error && (
        <div className="mt-4 w-full max-w-md">
          <ErrorPopup
            title="Registrierungsfehler"
            message={error}
            visible={true}
            position="bottom"
          />
        </div>
      )}

      {success && (
        <div className="mt-4 text-center text-green-600 font-semibold">
          ✓ Registrierung erfolgreich! Sie werden zum Login weitergeleitet...
        </div>
      )}
    </div>
  );
};

export default AdminRegister;
