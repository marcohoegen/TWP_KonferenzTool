import React, { useState } from "react";

interface ToolTipBotProps {
  text: string;
  children?: React.ReactNode;
  showDuration?: number;
}

export default function TooltipBaseBot({
  text,
  children,
  showDuration = 5000,
}: ToolTipBotProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(true);

    // Auto-hide after X seconds
    setTimeout(() => {
      setIsVisible(false);
    }, showDuration);
  };

  return (
    <span
      className="relative overflow-visible cursor-pointer group focus-visible:outline-none"
      onClick={handleClick}
    >
      {/* Trigger / Children */}
      {children}

      {/* Tooltip */}
      <span
        role="tooltip"
        className={`
          absolute top-full left-1/2 z-10 mt-2 w-fit h-fit 
          -translate-x-1/2 rounded text-green-500 border-2 
          border-green-500 p-2 text-sm transition-all 
          before:absolute before:left-1/2 before:bottom-full 
          before:-ml-2 before:border-x-8 before:border-b-8 
          before:border-x-transparent before:border-b-green-500

          ${isVisible ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        {text}
      </span>
    </span>
  );
}
