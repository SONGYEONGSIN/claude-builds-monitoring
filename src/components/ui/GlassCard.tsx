interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "primary" | "tertiary" | "error" | "warning";
}

export function GlassCard({ children, className = "", glow }: GlassCardProps) {
  const glowClass = glow ? `glow-${glow}` : "";
  return (
    <div
      className={`glass rounded-xl border border-outline-variant/10 ${glowClass} ${className}`}
    >
      {children}
    </div>
  );
}
