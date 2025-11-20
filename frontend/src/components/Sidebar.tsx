import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ButtonLanguage from "./ButtonLanguage";
import confeedLogo from "../assets/confeedlogo.svg";

interface SidebarProps {
  menuItems: Array<{ label: string; path: string }>;
  onWidthChange?: (width: number) => void;
}

export default function Sidebar({ menuItems, onWidthChange }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default 256px (w-64)
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      // Constrain width between 200px and 400px
      if (newWidth >= 200 && newWidth <= 400) {
        setSidebarWidth(newWidth);
        onWidthChange?.(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, onWidthChange]);

  return (
    <aside 
      ref={sidebarRef}
      style={{ width: `${sidebarWidth}px` }}
      className="fixed left-0 top-0 h-screen bg-white border-r-2 border-sky-500 flex flex-col"
    >
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
            className={`w-full text-left px-6 py-3 transition-colors break-words ${
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

      {/* Resize handle */}
      <div
        onMouseDown={() => setIsResizing(true)}
        className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-sky-300 active:bg-sky-500 transition-colors"
        title="Drag to resize sidebar"
      />
    </aside>
  );
}
