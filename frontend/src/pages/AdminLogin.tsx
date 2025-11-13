import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputFieldLogin from "../components/InputFieldLogin";
import InputFieldPassword from "../common/InputFieldPassword";
import confeedlogo from "../assets/confeedlogo.svg";
import ErrorPopup from "../common/ErrorPopup";
import ButtonLoadingAnimated from "../common/ButtonLoadingAnimated";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer); 
    }
  }, [error]);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login fehlgeschlagen. Bitte überprüfe deine Daten.");
      }

      const data = await response.json();

      if (data.success) {
        navigate("/newconference");
      } else {
        throw new Error("Login fehlgeschlagen");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          loading={loading}
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
