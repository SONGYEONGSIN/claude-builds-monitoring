import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PulsingDot } from "@/components/ui/PulsingDot";
import type { AgentStatus } from "@/types/agent";

const BORDER_HOVER: Record<string, string> = {
  primary: "hover:border-primary/40",
  secondary: "hover:border-secondary/40",
  tertiary: "hover:border-tertiary/40",
  error: "hover:border-error/40",
};

const ICON_COLOR: Record<string, string> = {
  primary: "text-primary border-primary/20",
  secondary: "text-secondary border-secondary/20",
  tertiary: "text-tertiary border-tertiary/20",
  error: "text-error border-error/20",
};

interface AgentCardProps {
  agent: AgentStatus;
}

export function AgentCard({ agent }: AgentCardProps) {
  const successBg = agent.status === "success" ? "bg-tertiary/5" : "";

  return (
    <GlassCard
      className={`p-5 ${BORDER_HOVER[agent.color]} transition-all group cursor-pointer ${successBg}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center ${ICON_COLOR[agent.color]} border shadow-inner group-hover:scale-110 transition-transform`}
        >
          <MaterialIcon icon={agent.icon} />
        </div>
        {agent.status === "success" ? (
          <div className="flex items-center gap-1.5">
            <PulsingDot color="tertiary" />
            <span className="text-tertiary text-[10px] font-bold uppercase">
              Success
            </span>
          </div>
        ) : (
          <StatusBadge status={agent.status} />
        )}
      </div>

      <h3 className="font-bold text-on-surface mb-1">{agent.displayName}</h3>
      <p className="text-[11px] text-slate-400 mb-4">{agent.description}</p>

      <div className="flex items-center gap-2">
        {agent.status === "alert" && (
          <>
            <MaterialIcon icon="warning" size="xs" className="text-error" />
            <span className="text-[10px] text-error italic">
              {agent.unreadMessages > 0
                ? `${agent.unreadMessages}개 알림`
                : "주의 필요"}
            </span>
          </>
        )}
        {agent.uptime && (
          <span className="text-[10px] text-slate-500 italic">
            가동 시간 {agent.uptime}
          </span>
        )}
        {agent.status === "idle" && (
          <span className="text-[10px] text-slate-500 italic">대기 중...</span>
        )}
      </div>
    </GlassCard>
  );
}
