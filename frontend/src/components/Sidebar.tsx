import { useNavigate, useLocation } from "react-router-dom";
import ButtonLanguage from "./ButtonLanguage";
import confeedLogo from "../assets/confeedlogo.svg";

interface SidebarProps {
  menuItems: Array<{ label: string; path: string }>;
}

export default function Sidebar({ menuItems }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r-2 border-sky-500 flex flex-col">
      {/* Logo at top */}
      <div className="p-6 border-b border-gray-200 flex justify-center items-center">
        <img src={confeedLogo} alt="Confeed Logo" className="h-20 w-auto" />
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-6 py-3 transition-colors ${
              location.pathname === item.path
                ? "bg-sky-500 text-white font-medium"
                : "text-gray-700 hover:bg-sky-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Language selector at bottom */}
      <div className="p-6 border-t border-gray-200 flex justify-center">
        <ButtonLanguage size={40} iconSize={22} />
      </div>
    </aside>
  );
}
