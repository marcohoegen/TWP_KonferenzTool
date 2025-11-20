import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
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
import TopMenuBar from "./components/TopMenuBar";
import Sidebar from "./components/Sidebar";
import type { ReactNode } from "react";

// Wrapper component that adds menu bar (mobile) and sidebar (desktop) to pages
function PageWithMenu({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate();
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isDesktop, setIsDesktop] = useState(false);

  // Track screen size to determine desktop vs mobile
  useEffect(() => {
    const checkScreenSize = () => {
      // Use 1120px to match Tailwind md breakpoint (70rem)
      setIsDesktop(window.innerWidth >= 1120);
    };
    
    // Check on mount
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Userverwaltung", path: "/userpanel" },
    { label: "New Conference", path: "/newconference" },
    { label: "Admin CRUD", path: "/crud/admins" },
    { label: "Konferenz CRUD", path: "/crud/conferences" },
    { label: "Präsentationen CRUD", path: "/crud/presentations" },
    { label: "Bewertungen CRUD", path: "/crud/ratings" },
    { label: "Benutzer CRUD", path: "/crud/users" },
    { label: "Beispielkomponenten", path: "/componentshowcase" },
  ];

  return (
    <>
      {/* Mobile menu bar - hidden on desktop (md breakpoint and up) */}
      <div className="md:hidden">
        <TopMenuBar 
          pageTitle={title} 
          menuItems={menuItems}
          onNavigate={(path) => navigate(path)}
        />
      </div>

      {/* Desktop sidebar - hidden on mobile, shown on desktop */}
      <div className="hidden md:block">
        <Sidebar menuItems={menuItems} onWidthChange={setSidebarWidth} />
      </div>

      {/* Content area - with padding for mobile top bar or desktop sidebar */}
      <div 
        className="pt-16 md:pt-0"
        style={{ 
          paddingLeft: isDesktop ? `${sidebarWidth}px` : 0,
          transition: isDesktop ? 'padding-left 75ms' : 'none'
        }}
      >
        {children}
      </div>
    </>
  );
}

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
        <Route path="/" element={<PageWithMenu title="Home"><HomePage /></PageWithMenu>} />
        <Route path="/adminseite" element={<AdminSeite />} />
        <Route path="/userpanel" element={<PageWithMenu title="Userverwaltung"><UserPanel /></PageWithMenu>} />
        <Route path="/newconference" element={<PageWithMenu title="New Conference"><NewConference /></PageWithMenu>} />
        <Route path="/componentshowcase" element={<PageWithMenu title="Beispielkomponenten"><ComponentShowCase /></PageWithMenu>} />
        <Route path="/crud/admins" element={<PageWithMenu title="Admin CRUD"><AdminCRUD /></PageWithMenu>} />
        <Route path="/crud/conferences" element={<PageWithMenu title="Konferenz CRUD"><ConferenceCRUD /></PageWithMenu>} />
        <Route path="/crud/presentations" element={<PageWithMenu title="Präsentationen CRUD"><PresentationCRUD /></PageWithMenu>} />
        <Route path="/crud/ratings" element={<PageWithMenu title="Bewertungen CRUD"><RatingCRUD /></PageWithMenu>} />
        <Route path="/crud/users" element={<PageWithMenu title="Benutzer CRUD"><UserCRUD /></PageWithMenu>} />
      </Routes>
    </Router>
  );
}
