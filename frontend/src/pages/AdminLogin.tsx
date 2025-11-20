import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputFieldLogin from "../components/InputFieldLogin";
import InputFieldPassword from "../common/InputFieldPassword";
import confeedlogo from "../assets/confeedlogo.svg";
import ErrorPopup from "../common/ErrorPopup";
import ButtonLoadingAnimated from "../common/ButtonLoadingAnimated";
import { useAdminAdminControllerLogin } from "../api/generate/hooks/AdminService.hooks";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const loginMutation = useAdminAdminControllerLogin();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer); 
    }
  }, [error]);

  const handleLogin = () => {
    setError(null);

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.success) {
            navigate("/newconference");
          } else {
            setError("Falsche E-Mail oder Passwort");
          }
        },
        onError: () => {
          // Always show user-friendly message for login errors
          setError("Falsche E-Mail oder Passwort");
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center mt-12 px-4">
      <img src={confeedlogo} alt="Confeed Logo" className="w-[85vw] max-w-xs h-auto mx-auto" />
      <h2 className="text-xl font-semibold mt-4">Admin-Login</h2>

      <div className="flex flex-col gap-4 w-full max-w-md mt-6">
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
          initialValue="IloveConfeed123!"
        />
      </div>

      <div className="mt-6 w-full max-w-md">
        <ButtonLoadingAnimated
          text="Einloggen"
          loadingText="Wird geladen..."
          onClick={handleLogin}
        />
      </div>

      {error && (
        <div className="mt-4 w-full max-w-md">
          <ErrorPopup
            title="Fehler beim Einloggen"
            message={error}
            visible={true}
            position="bottom"
          />
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
