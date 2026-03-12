interface ProgressProps {
  value?: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({
  value = 0,
  className = "",
  indicatorClassName = "",
}: ProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className={`h-2 rounded-full transition-all duration-300 ${
          indicatorClassName || "bg-black"
        }`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
