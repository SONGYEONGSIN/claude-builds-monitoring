import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PulsingDot } from "@/components/ui/PulsingDot";

interface LayerCardProps {
  number: string;
  title: string;
  href: string;
  children: React.ReactNode;
  status?: "ok" | "warn" | "error";
  statusText?: string;
}

export function LayerCard({ number, title, href, children, status = "ok", statusText }: LayerCardProps) {
  return (
    <Link href={href} className="block group">
      <div className={`glass rounded-xl border transition-all duration-300 p-5 ${
        status === "error"
          ? "border-error/30 glow-error"
          : status === "warn"
            ? "border-warning/30 glow-warning"
            : "border-outline-variant/10 hover:border-primary/30"
      } group-hover:shadow-[0_0_25px_rgba(58,223,250,0.1)]`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold font-headline">
              {number}
            </span>
            <h3 className="font-headline text-sm font-bold text-on-surface">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {statusText && (
              <span className={`text-[10px] font-bold ${
                status === "error" ? "text-error" : status === "warn" ? "text-warning" : "text-tertiary"
              }`}>
                {statusText}
              </span>
            )}
            {status !== "ok" && <PulsingDot color={status === "error" ? "error" : "warning"} />}
            <MaterialIcon icon="arrow_forward" size="xs" className="text-slate-500 group-hover:text-primary transition-colors" />
          </div>
        </div>
        {children}
      </div>
    </Link>
  );
}
