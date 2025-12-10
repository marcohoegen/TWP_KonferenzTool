import "./App.css";
import {
  Routes,
  Route,
  useNavigate,
  BrowserRouter,
  useParams,
} from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import AdminSeite from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminLogout from "./pages/AdminLogout";
import UserLogout from "./pages/UserLogout";
import ConferenceCRUD from "./pages/ConferenceCRUD";
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
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";

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
      { label: "Logout", path: "/admin/logout" },
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

export default function App() {
  const AdminMainMenu = [
    { label: "Konferenzen", path: "/admin/dashboard" },
    { label: "Einstellungen", path: "/settings" },
    { label: "Logout", path: "/admin/logout" },
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
      <AdminAuthProvider>
        <UserAuthProvider>
          <Routes>
            {/* Public Route - User Login */}
            <Route path="/" element={<RateLogin />} />

            {/* Admin Public Routes */}
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/login" element={<AdminSeite />} />
            <Route path="/admin/logout" element={<AdminLogout />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <PageWithMenu
                    title="Konferenz-Verwaltung"
                    menuItems={AdminMainMenu}
                  >
                    <ConferenceCRUD />
                  </PageWithMenu>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/:conferenceId/users"
              element={
                <ProtectedAdminRoute>
                  <PageWithMenu
                    title="Benutzer-Verwaltung"
                    menuItems={AdminConferenceMenu}
                  >
                    <ConferenceDashboardUserView />
                  </PageWithMenu>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/:conferenceId/sessions"
              element={
                <ProtectedAdminRoute>
                  <PageWithMenu
                    title="Sessions & Präsentationen"
                    menuItems={AdminConferenceMenu}
                  >
                    <ConferenceDashboardSessionView />
                  </PageWithMenu>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/:conferenceId/sessions/:sessionId/presentations"
              element={
                <ProtectedAdminRoute>
                  <PageWithMenu
                    title="Präsentations-Verwaltung"
                    menuItems={AdminConferenceMenu}
                  >
                    <ConferenceDashboardPresentationView />
                  </PageWithMenu>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/:conferenceId/presentations"
              element={
                <ProtectedAdminRoute>
                  <PageWithMenu
                    title="Präsentations-Verwaltung"
                    menuItems={AdminConferenceMenu}
                  >
                    <ConferenceDashboardPresentationView />
                  </PageWithMenu>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/:conferenceId/ratings"
              element={
                <ProtectedAdminRoute>
                  <PageWithMenu
                    title="Bewertungen & Analytics"
                    menuItems={AdminConferenceMenu}
                  >
                    <ConferenceDashboardRatingsView />
                  </PageWithMenu>
                </ProtectedAdminRoute>
              }
            />

            {/* User Logout Route */}
            <Route path="/rate/logout" element={<UserLogout />} />

            {/* Protected User Routes */}
            <Route
              path="/rate/wait"
              element={
                <ProtectedUserRoute>
                  <RateWaitingRoom />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/rate/overview/:presentationId?"
              element={
                <ProtectedUserRoute>
                  <RateOverview />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/rate/presentation/:presentationId"
              element={
                <ProtectedUserRoute>
                  <RatePresentation />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/rate/thanks"
              element={
                <ProtectedUserRoute>
                  <RateThanks />
                </ProtectedUserRoute>
              }
            />
          </Routes>
        </UserAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
