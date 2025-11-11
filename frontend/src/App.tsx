import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import type { AdminData } from "./entities/adminEntity";
import ButtonRoundedLgPrimaryBasic from "./common/ButtonRoundedLgPrimaryBasic";
import AdminSeite from "./pages/AdminLogin";
import CustomerSeite from "./pages/CustomerSeite";
import confeedlogo from "./assets/confeedlogo.svg";
import NewConference from "./pages/NewConference";
import ComponentShowCase from "./pages/ComponentShowcase";

const HomePage = () => {
  const [data, setData] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/admin")
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Daten");
        return res.json();
      })
      .then((data: AdminData[]) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  

  if (loading) return <p>Lade Daten…</p>;
  if (error) return <p>Fehler: {error}</p>;

  return (
    <div className="p-4">
      <h2>Confeed</h2>
      <ul>
        {data.map((a) => (
          <li key={a.id}>
            {a.name} ({a.email})
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/adminseite")}>
          Admin
        </ButtonRoundedLgPrimaryBasic>

        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/customerseite")}>
         Abstimmung
        </ButtonRoundedLgPrimaryBasic>

        <ButtonRoundedLgPrimaryBasic onClick={()=> navigate("/newconference")}>
          New Conference
        </ButtonRoundedLgPrimaryBasic>
        <ButtonRoundedLgPrimaryBasic
          onClick={() => navigate("/componentshowcase")}
        >
          Beispielkomponenten
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
}

export default function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/adminseite" element={<AdminSeite />} />
      <Route path="/customerseite" element={<CustomerSeite />} />
      <Route path="/newconference" element={<NewConference />} />
        <Route path="/componentshowcase" element={<ComponentShowCase />} />
    </Routes>
    </Router>
  );
}