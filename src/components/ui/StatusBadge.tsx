import type { AgentStatusType } from "@/types/agent";

const STATUS_STYLES: Record<AgentStatusType, string> = {
  processing:
    "bg-primary/10 text-primary border-primary/20",
  idle: "bg-slate-800 text-slate-400 border-outline-variant/20",
  success:
    "bg-tertiary/10 text-tertiary border-tertiary/20",
  alert: "bg-error/10 text-error border-error/20",
};

const STATUS_LABELS: Record<AgentStatusType, string> = {
  processing: "Processing",
  idle: "Idle",
  success: "Success",
  alert: "Alert",
};

interface StatusBadgeProps {
  status: AgentStatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
