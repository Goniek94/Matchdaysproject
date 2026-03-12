import React from "react";

export function Card({ className = "", children }: any) {
  return (
    <div className={`rounded-xl border bg-white ${className}`}>{children}</div>
  );
}

export function CardHeader({ className = "", children }: any) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }: any) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ className = "", children }: any) {
  return <div className={`p-4 pt-0 ${className}`}>{children}</div>;
}
