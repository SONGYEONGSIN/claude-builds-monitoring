"use client";

interface MaterialIconProps {
  icon: string;
  className?: string;
  filled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const SIZE_MAP = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
  xl: "text-3xl",
};

export function MaterialIcon({
  icon,
  className = "",
  filled = false,
  size = "md",
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${SIZE_MAP[size]} ${className}`}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {icon}
    </span>
  );
}
