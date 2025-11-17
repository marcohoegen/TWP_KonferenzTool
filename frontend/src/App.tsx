import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import ButtonRoundedLgPrimaryBasic from "./common/ButtonRoundedLgPrimaryBasic";
import AdminSeite from "./pages/AdminLogin";
import UserPanel from "./pages/UserPanel";
import confeedlogo from "./assets/confeedlogo.svg";
import NewConference from "./pages/NewConference";
import ComponentShowCase from "./pages/ComponentShowcase";
import AdminCRUD from "./pages/AdminCRUD";
import ConferenceCRUD from "./pages/ConferenceCRUD";
import PresentationCRUD from "./pages/PresentationCRUD";
import RatingCRUD from "./pages/RatingCRUD";
import UserCRUD from "./pages/UserCRUD";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2>Confeed</h2>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/adminseite")}>
          Admin Login
        </ButtonRoundedLgPrimaryBasic>

        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/userpanel")}>
          Userverwaltung
        </ButtonRoundedLgPrimaryBasic>

        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/newconference")}>
          New Conference
        </ButtonRoundedLgPrimaryBasic>

        <h3 className="mt-4 font-bold">CRUD Verwaltung</h3>

        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/crud/admins")}>
          Admin CRUD
        </ButtonRoundedLgPrimaryBasic>

        <ButtonRoundedLgPrimaryBasic
          onClick={() => navigate("/crud/conferences")}
        >
          Konferenz CRUD
        </ButtonRoundedLgPrimaryBasic>

        <ButtonRoundedLgPrimaryBasic
          onClick={() => navigate("/crud/presentations")}
        >
          Präsentationen CRUD
        </ButtonRoundedLgPrimaryBasic>

        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/crud/ratings")}>
          Bewertungen CRUD
        </ButtonRoundedLgPrimaryBasic>

        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/crud/users")}>
          Benutzer CRUD
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
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adminseite" element={<AdminSeite />} />
        <Route path="/userpanel" element={<UserPanel />} />
        <Route path="/newconference" element={<NewConference />} />
        <Route path="/componentshowcase" element={<ComponentShowCase />} />
        <Route path="/crud/admins" element={<AdminCRUD />} />
        <Route path="/crud/conferences" element={<ConferenceCRUD />} />
        <Route path="/crud/presentations" element={<PresentationCRUD />} />
        <Route path="/crud/ratings" element={<RatingCRUD />} />
        <Route path="/crud/users" element={<UserCRUD />} />
      </Routes>
    </Router>
  );
}
