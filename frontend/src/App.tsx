import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import ButtonRoundedLgPrimaryBasic from "./common/ButtonRoundedLgPrimaryBasic";
import AdminSeite from "./pages/AdminLogin";
import CustomerSeite from "./pages/CustomerSeite";
import confeedlogo from "./assets/confeedlogo.svg";
import { useAdminAdminControllerFindAll } from "./api/generate/hooks/AdminService.hooks";
import ConferenceCRUDDemo from "./components/ConferenceCRUDDemo";

const HomePage = () => {
  const navigate = useNavigate();

  const {
    data: admins,
    isLoading,
    error,
  } = useAdminAdminControllerFindAll(undefined, undefined);

  if (isLoading) return <p>Lade Daten…</p>;
  if (error) return <p>Fehler: {error.message}</p>;

  return (
    <div className="p-4">
      <h2>Confeed</h2>
      <ul>
        {admins?.map((a) => (
          <li key={a.id}>
            {a.name} ({a.email})
          </li>
        ))}
      </ul>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/adminseite")}>
          Admin
        </ButtonRoundedLgPrimaryBasic>

        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/customerseite")}>
          Abstimmung
        </ButtonRoundedLgPrimaryBasic>
        <img
          src={confeedlogo}
          alt="Confeed Logo"
          className="logo confeed"
          width={400}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adminseite" element={<AdminSeite />} />
        <Route path="/customerseite" element={<CustomerSeite />} />
        <Route path="/conferencecruddemo" element={<ConferenceCRUDDemo />} />
      </Routes>
    </Router>
  );
}
