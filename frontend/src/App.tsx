import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import type { AdminData } from "./entities/adminEntity";
import ButtonRoundedLgPrimaryBasic from "./components/ButtonRoundedLgPrimaryBasic";
import AdminSeite from "./pages/AdminSeite";
import CustomerSeite from "./pages/CustomerSeite";

const HomePage = () => {
  const [data, setData] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // 👈 React Router Hook für Navigation

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

      {/* ✅ Buttons für Navigation */}
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/adminseite")}>
          Admin
        </ButtonRoundedLgPrimaryBasic>

        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/customerseite")}>
         Abstimmung
        </ButtonRoundedLgPrimaryBasic>
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
    </Routes>
    </Router>
  );
}