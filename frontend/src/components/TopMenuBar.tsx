import ButtonMenu from "./ButtonMenu";
import confeedLogo from "../assets/confeedMinimal.svg";

interface TopMenuBarProps {
  pageTitle: string;
  menuItems?: Array<{ label: string; path: string }>;
  onNavigate?: (path: string) => void;
}

export default function TopMenuBar({
  pageTitle,
  menuItems = [],
  onNavigate,
}: TopMenuBarProps) {
  return (
    <div className="w-full bg-white border-b-2 border-sky-500 px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      {/* Logo on the left */}
      <div className="flex items-center flex-shrink-0">
        <img src={confeedLogo} alt="Confeed Logo" className="h-12 w-auto" />
      </div>

      {/* Page title in center */}
      <div className="flex-1 text-center">
        <span className="text-2xl font-semibold text-gray-900">
          {pageTitle}
        </span>
      </div>

      {/* Menu button on right */}
      <div className="flex items-center flex-shrink-0">
        <ButtonMenu items={menuItems} size={24} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
