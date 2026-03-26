import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PulsingDot } from "@/components/ui/PulsingDot";

interface ComponentStatus {
  name: string;
  count: number;
  icon: string;
  items: { name: string; status: "active" | "idle" | "error" }[];
}

interface BuildOverviewProps {
  agentCount: number;
  activeAgents: number;
  alertAgents: number;
  hookCount: number;
  hookFails: number;
  skillCount: number;
  messageCount: number;
  sessionCount: number;
}

export function BuildOverview({
  agentCount,
  activeAgents,
  alertAgents,
  hookCount,
  hookFails,
  skillCount,
  messageCount,
  sessionCount,
}: BuildOverviewProps) {
  const sections: {
    label: string;
    icon: string;
    value: string;
    sub: string;
    color: string;
    status: "ok" | "warn" | "error";
  }[] = [
    {
      label: "에이전트",
      icon: "smart_toy",
      value: `${agentCount}개`,
      sub: activeAgents > 0 ? `${activeAgents}개 활성` : "전체 대기",
      color: "text-primary",
      status: alertAgents > 0 ? "warn" : "ok",
    },
    {
      label: "훅 파이프라인",
      icon: "bolt",
      value: `${hookCount}개`,
      sub: hookFails > 0 ? `${hookFails}건 실패` : "전체 정상",
      color: "text-secondary",
      status: hookFails > 0 ? "error" : "ok",
    },
    {
      label: "스킬",
      icon: "extension",
      value: `${skillCount}개`,
      sub: "등록됨",
      color: "text-tertiary",
      status: "ok",
    },
    {
      label: "메시지 버스",
      icon: "hub",
      value: `${messageCount}건`,
      sub: "전체 메시지",
      color: "text-warning",
      status: "ok",
    },
    {
      label: "세션",
      icon: "terminal",
      value: `${sessionCount}개`,
      sub: "기록됨",
      color: "text-primary",
      status: "ok",
    },
    {
      label: "오케스트레이터",
      icon: "account_tree",
      value: "2종",
      sub: "Claude Squad · AO",
      color: "text-secondary",
      status: "ok",
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="font-headline text-xl font-bold text-on-surface mb-4">
        빌드 시스템 현황
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {sections.map((s) => (
          <GlassCard
            key={s.label}
            glow={s.status === "error" ? "error" : s.status === "warn" ? "warning" : undefined}
            className="p-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <MaterialIcon icon={s.icon} size="sm" className={s.color} />
              {s.status !== "ok" && (
                <PulsingDot color={s.status === "error" ? "error" : "warning"} />
              )}
            </div>
            <p className="text-lg font-bold text-on-surface font-headline">{s.value}</p>
            <p className="text-[10px] text-slate-500">{s.label}</p>
            <p
              className={`text-[10px] mt-1 ${
                s.status === "error"
                  ? "text-error"
                  : s.status === "warn"
                    ? "text-warning"
                    : "text-tertiary"
              }`}
            >
              {s.sub}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
