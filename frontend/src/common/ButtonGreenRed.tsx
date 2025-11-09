import { useState } from "react";

interface ButtonGreenRedProps {
  text?: string;
  width?: string;       // z. B. "w-32" oder "w-full"
  onClick?: () => void; // Externer Klickhandler (optional)
  initialColor?: "green" | "red";
}

export default function ButtonGreenRed({
  text = "Button",
  width = "w-auto",
  onClick,
  initialColor = "green",
}: ButtonGreenRedProps) {
  const [color, setColor] = useState<"green" | "red">(initialColor);

  // Farben analog zu ButtonImport
  const colorClasses =
    color === "green"
      ? "bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700"
      : "bg-red-500 hover:bg-red-600 focus:bg-red-700";

  const handleClick = () => {
    setColor(prev => (prev === "green" ? "red" : "green"));
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex ${width} h-10 items-center justify-center gap-2 whitespace-nowrap rounded px-5 text-sm font-medium tracking-wide text-white transition duration-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:shadow-none ${colorClasses}`}
    >
      <span>{text}</span>
    </button>
  );
}
