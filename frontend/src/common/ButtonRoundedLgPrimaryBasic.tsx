import { useState } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "customer";
  size?: "lg"
};

export default function ButtonRoundedLgPrimaryBasic({
  children,
  type = "button",
  variant = "primary",
  ...props
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    borderRadius: "20px",
    padding: "20px 60px",
    cursor: "pointer",
    fontWeight: 500,
    transition: "all 0.2s ease",
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: isHovered ? "#1d4ed8" : "#6583c2ff", // dunkler beim Hover
      color: "white",
      border: "none",
    },
    customer: {
      backgroundColor: isHovered ? "#e5e7eb" : "#f3f4f6", // leicht dunkler
      color: "#374151",
      border: "2px solid #9ca3af",
    },
  };

  return (
    <button
      type={type}
      {...props}
      style={{
        ...baseStyle,
        ...variants[variant],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
}