interface PulsingDotProps {
  color?: "primary" | "tertiary" | "error" | "warning";
  size?: "sm" | "md";
}

const COLOR_MAP = {
  primary: "bg-primary",
  tertiary: "bg-tertiary",
  error: "bg-error",
  warning: "bg-warning",
};

export function PulsingDot({ color = "primary", size = "sm" }: PulsingDotProps) {
  const sizeClass = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";
  return (
    <span
      className={`${sizeClass} ${COLOR_MAP[color]} rounded-full animate-pulse-primary`}
    />
  );
}
