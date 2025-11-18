import React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "customer";
  size?: "lg" | "md" | "sm";
};

export default function ButtonRoundedLgPrimaryBasic({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Props) {
  const base =
    "rounded-2xl font-medium transition duration-200 focus:outline-none disabled:opacity-60";

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variants = {
    primary: "bg-sky-500 hover:bg-sky-600 text-white",
    customer:
      "bg-gray-100 hover:bg-gray-200 text-slate-700 border border-gray-300",
  };

  return (
    <button
      type={type}
      {...props}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}