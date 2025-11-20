import ButtonMenu from "./ButtonMenu";
import ButtonLanguage from "./ButtonLanguage";

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
    <div className="w-screen bg-white border-b-2 border-sky-500 px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      {/* Empty space on left for balance */}
      <div className="w-20"></div>
      
      {/* Page title in center */}
      <div className="flex-1 text-center">
        <span className="text-base font-medium text-gray-900">{pageTitle}</span>
      </div>
      
      {/* Buttons on right */}
      <div className="flex items-center gap-3">
        <ButtonLanguage size={36} iconSize={20} />
        <ButtonMenu items={menuItems} size={24} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
