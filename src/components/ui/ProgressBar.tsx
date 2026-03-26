interface ProgressBarProps {
  value: number;
  color?: "primary" | "secondary" | "tertiary" | "error";
  animate?: boolean;
}

const COLOR_MAP = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
  error: "bg-error",
};

export function ProgressBar({
  value,
  color = "primary",
  animate = false,
}: ProgressBarProps) {
  return (
    <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
      <div
        className={`h-full ${COLOR_MAP[color]} rounded-full transition-all duration-500 ${
          animate ? "animate-pulse-primary" : ""
        }`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
