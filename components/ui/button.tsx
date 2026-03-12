import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export function Button({
  className = "",
  variant = "default",
  children,
  ...props
}: ButtonProps) {
  const styles =
    variant === "outline"
      ? "border border-gray-200 bg-white hover:bg-gray-50"
      : "bg-black text-white hover:bg-black/90";

  return (
    <button
      className={`flex items-center justify-center px-4 py-2 rounded-lg transition ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
