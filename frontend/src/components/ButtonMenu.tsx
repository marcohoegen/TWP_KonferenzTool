import { useState, useRef, useEffect } from "react";
import menuIcon from "../assets/menuIcon.svg";

interface MenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface ButtonMenuProps {
  items?: MenuItem[];
  size?: number;
  className?: string;
  onNavigate?: (path: string) => void;
}

export default function ButtonMenu({
  items = [],
  size = 24,
  className = "",
  onNavigate,
}: ButtonMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleMenuItemClick = (path: string) => {
    setOpen(false);
    onNavigate?.(path);
  };

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 transition ${className}`}
        aria-label="Menü öffnen"
        aria-expanded={open}
      >
        <img
          src={menuIcon}
          alt="Menu icon"
          style={{ width: size, height: size }}
          className="pointer-events-none select-none"
        />
      </button>

      {/* Menu Dropdown */}
      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-40"
          role="menu"
        >
          <div className="py-2">
            {items.length > 0 ? (
              items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuItemClick(item.path)}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition flex items-center gap-2"
                  role="menuitem"
                >
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-slate-400">
                Keine Menüeinträge
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}