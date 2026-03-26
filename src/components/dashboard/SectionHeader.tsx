"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PulsingDot } from "@/components/ui/PulsingDot";

interface SectionHeaderProps {
  number: string;
  title: string;
  badge?: string;
  status?: "active" | "idle" | "error" | "warn";
  statusText?: string;
  detail?: string;
}

const STATUS_CONFIG = {
  active: {
    numBg: "bg-primary/20 border border-primary/40 shadow-[0_0_12px_rgba(58,223,250,0.3)]",
    numText: "text-primary",
    barColor: "bg-primary",
    dotColor: "primary" as const,
    label: "가동 중",
    labelColor: "text-primary",
  },
  idle: {
    numBg: "bg-surface-container border border-outline-variant/20",
    numText: "text-slate-500",
    barColor: "bg-slate-700",
    dotColor: "primary" as const,
    label: "대기",
    labelColor: "text-slate-500",
  },
  error: {
    numBg: "bg-error/20 border border-error/40 shadow-[0_0_12px_rgba(255,113,108,0.3)]",
    numText: "text-error",
    barColor: "bg-error",
    dotColor: "error" as const,
    label: "실패",
    labelColor: "text-error",
  },
  warn: {
    numBg: "bg-warning/20 border border-warning/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]",
    numText: "text-warning",
    barColor: "bg-warning",
    dotColor: "warning" as const,
    label: "주의",
    labelColor: "text-warning",
  },
};

export function SectionHeader({ number, title, badge, status = "idle", statusText, detail }: SectionHeaderProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        {/* 번호 뱃지 — 상태에 따라 글로우 */}
        {number && (
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-headline transition-all duration-500 ${config.numBg} ${config.numText}`}>
            {number}
          </span>
        )}

        <h2 className="font-headline text-xl font-bold text-on-surface">{title}</h2>

        {badge && (
          <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-sm font-bold uppercase">
            {badge}
          </span>
        )}

        {/* 상태 인디케이터 */}
        <div className="flex items-center gap-2 ml-auto">
          {status !== "idle" && <PulsingDot color={config.dotColor} size="md" />}
          <span className={`text-[10px] font-bold uppercase ${config.labelColor}`}>
            {statusText ?? config.label}
          </span>
          {detail && (
            <span className="text-[10px] text-slate-500">{detail}</span>
          )}
        </div>
      </div>

      {/* 하단 진행 바 — 상태에 따라 색상 + 애니메이션 */}
      <div className="h-0.5 w-full bg-surface-container rounded-full overflow-hidden mt-2">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${config.barColor} ${
            status === "active" ? "animate-pulse-slow w-full" :
            status === "error" ? "w-full" :
            status === "warn" ? "w-3/4" :
            "w-0"
          }`}
        />
      </div>
    </div>
  );
}
