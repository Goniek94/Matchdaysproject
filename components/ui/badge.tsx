import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary";
}

export function Badge({
  children,
  className = "",
  variant = "default",
}: BadgeProps) {
  const styles =
    variant === "outline"
      ? "border border-gray-200"
      : variant === "secondary"
        ? "bg-gray-200 text-gray-800"
        : "bg-black text-white";

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${styles} ${className}`}
    >
      {children}
    </span>
  );
}
