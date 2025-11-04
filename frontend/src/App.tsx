import './App.css'
import { useEffect, useState } from "react";
import type { AdminData } from "./entities/Admin";

const App = () => {
  const [data, setData] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  else if (error) return <p>Fehler: {error}</p>;
  else
    return (
      <div>
        <h2>Admin Liste</h2>
        <ul>
          {data.map((admin) => (
            <li key={admin.id}>
              {admin.name} ({admin.email})
            </li>
          ))}
        </ul>
      </div>
    );
};

export default App;