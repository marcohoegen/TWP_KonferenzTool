import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  BrowserRouter,
  useParams,
} from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import ButtonRoundedLgPrimaryBasic from "./common/ButtonRoundedLgPrimaryBasic";
import AdminSeite from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import UserPanel from "./pages/UserPanel";
import confeedlogo from "./assets/confeedMinimal.svg";
import NewConference from "./pages/NewConference";
import ComponentShowCase from "./pages/ComponentShowcase";
import AdminCRUD from "./pages/AdminCRUD";
import ConferenceCRUD from "./pages/ConferenceCRUD";
import PresentationCRUD from "./pages/PresentationCRUD";
import RatingCRUD from "./pages/RatingCRUD";
import UserCRUD from "./pages/UserCRUD";
import RateLogin from "./pages/RateLogin";
import RateWaitingRoom from "./pages/RateWaitingRoom";
import RateOverview from "./pages/RateOverview";
import RatePresentation from "./pages/RatePresentation";
import RateThanks from "./pages/RateThanks";
import TopMenuBar from "./components/TopMenuBar";
import Sidebar from "./components/Sidebar";
import type { ReactNode } from "react";
import ConferenceDashboardUserView from "./pages/ConferenceDashboardUserView";
import ConferenceDashboardPresentationView from "./pages/ConferenceDashboardPresentationView";
import ConferenceDashboardSessionView from "./pages/ConferenceDashboardSessionView";
import ConferenceDashboardRatingsView from "./pages/ConferenceDashboardRatingsView";

// Wrapper component that adds menu bar (mobile) and sidebar (desktop) to pages
function PageWithMenu({
  children,
  title,
  menuItems,
}: {
  children: ReactNode;
  title: string;
  menuItems?: { label: string; path: string }[];
}) {
  const navigate = useNavigate();
  const { conferenceId } = useParams<{ conferenceId?: string }>();
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
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const defaultMenuItems = useMemo(
    () => [
      { label: "Konferenzverwaltung", path: "/admin/dashboard" },
      { label: "Settings", path: "/settings" },
      { label: "Logout", path: "/logout" },
    ],
    []
  );

  const activeMenuItems = useMemo(() => {
    const items = menuItems || defaultMenuItems;
    // Replace :conferenceId with actual conferenceId from URL params
    if (conferenceId) {
      return items.map((item) => ({
        ...item,
        path: item.path.replace(":conferenceId", conferenceId),
      }));
    }
    return items;
  }, [menuItems, defaultMenuItems, conferenceId]);

  return (
    <>
      {/* Mobile menu bar - hidden on desktop (md breakpoint and up) */}
      <div className="md:hidden">
        <TopMenuBar
          pageTitle={title}
          menuItems={activeMenuItems}
          onNavigate={(path) => navigate(path)}
        />
      </div>

      {/* Desktop sidebar - hidden on mobile, shown on desktop */}
      <div className="hidden md:block">
        <Sidebar menuItems={activeMenuItems} onWidthChange={setSidebarWidth} />
      </div>

      {/* Content area - with padding for mobile top bar or desktop sidebar */}
      <div
        className="pt-16 md:pt-0"
        style={{
          paddingLeft: isDesktop ? `${sidebarWidth}px` : 0,
          transition: isDesktop ? "padding-left 75ms" : "none",
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
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <img
          src={confeedlogo}
          alt="Confeed Logo"
          className="logo confeed"
          width={400}
        />
        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/adminseite")}>
          Admin Login
        </ButtonRoundedLgPrimaryBasic>

        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/rate/login")}>
          Rate Presentation
        </ButtonRoundedLgPrimaryBasic>

        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/userpanel")}>
          Userverwaltung
        </ButtonRoundedLgPrimaryBasic>

        <ButtonRoundedLgPrimaryBasic onClick={() => navigate("/newconference")}>
          New Conference
        </ButtonRoundedLgPrimaryBasic>

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
      </div>
    </div>
  );
};

export default function App() {
  const AdminMainMenu = [
    { label: "Konferenzen", path: "/admin/dashboard" },
    { label: "Settings", path: "/settings" },
    { label: "Logout", path: "/logout" },
  ];

  const AdminConferenceMenu = [
    { label: "Benutzer-Verwaltung", path: "/admin/:conferenceId/users" },
    {
      label: "Sessions & Präsentationen",
      path: "/admin/:conferenceId/sessions",
    },
    {
      label: "Bewertungen & Analytics",
      path: "/admin/:conferenceId/ratings",
    },
    { label: "Zurück zu Konferenzen", path: "/admin/dashboard" },
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RateLogin />} />

        {/* Admin Ansichten */}

        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminSeite />} />
        <Route
          path="/admin/dashboard"
          element={
            <PageWithMenu title="Konferenz-Verwaltung" menuItems={AdminMainMenu}>
              <ConferenceCRUD />
            </PageWithMenu>
          }
        />
        <Route
          path="/admin/:conferenceId/users"
          element={
            <PageWithMenu
              title="Benutzer-Verwaltung"
              menuItems={AdminConferenceMenu}
            >
              <ConferenceDashboardUserView />
            </PageWithMenu>
          }
        />
        <Route
          path="/admin/:conferenceId/sessions"
          element={
            <PageWithMenu
              title="Sessions & Präsentationen"
              menuItems={AdminConferenceMenu}
            >
              <ConferenceDashboardSessionView />
            </PageWithMenu>
          }
        />
        <Route
          path="/admin/:conferenceId/sessions/:sessionId/presentations"
          element={
            <PageWithMenu
              title="Präsentations-Verwaltung"
              menuItems={AdminConferenceMenu}
            >
              <ConferenceDashboardPresentationView />
            </PageWithMenu>
          }
        />
        <Route
          path="/admin/:conferenceId/presentations"
          element={
            <PageWithMenu
              title="Präsentations-Verwaltung"
              menuItems={AdminConferenceMenu}
            >
              <ConferenceDashboardPresentationView />
            </PageWithMenu>
          }
        />
        <Route
          path="/admin/:conferenceId/ratings"
          element={
            <PageWithMenu
              title="Bewertungen & Analytics"
              menuItems={AdminConferenceMenu}
            >
              <ConferenceDashboardRatingsView />
            </PageWithMenu>
          }
        />

        {/* User Ansichten */}

        <Route path="/rate/wait" element={<RateWaitingRoom />} />
        <Route
          path="/rate/overview/:presentationId?"
          element={<RateOverview />}
        />
        <Route
          path="/rate/presentation/:presentationId"
          element={<RatePresentation />}
        />
        <Route path="/rate/thanks" element={<RateThanks />} />
      </Routes>
    </BrowserRouter>
  );
}
