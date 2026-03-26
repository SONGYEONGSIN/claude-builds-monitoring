import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PulsingDot } from "@/components/ui/PulsingDot";

interface GlobalStatsProps {
  activeAgents: number;
  alertAgents: number;
  totalAgents: number;
  unreadMessages: number;
  totalMessages: number;
  todayEvents: number;
  todayFails: number;
  successRate: number;
  sessionCount: number;
}

export function GlobalStats({
  activeAgents,
  alertAgents,
  totalAgents,
  unreadMessages,
  totalMessages,
  todayEvents,
  todayFails,
  successRate,
  sessionCount,
}: GlobalStatsProps) {
  return (
    <GlassCard className="p-6 flex flex-col justify-between">
      <div>
        <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
          시스템 상태
        </h3>
        <p className="text-[10px] text-slate-500">실시간 빌드 시스템 요약</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {/* 에이전트 */}
        <div className="p-3 bg-surface-container-high rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-500">에이전트</span>
            {alertAgents > 0 && <PulsingDot color="error" />}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-primary">{activeAgents}</span>
            <span className="text-[10px] text-slate-500">/ {totalAgents} 활성</span>
          </div>
          {alertAgents > 0 && (
            <p className="text-[10px] text-error mt-0.5">{alertAgents}개 알림</p>
          )}
        </div>

        {/* 메시지 */}
        <div className="p-3 bg-surface-container-high rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-500">메시지 버스</span>
            {unreadMessages > 0 && <PulsingDot color="warning" />}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-secondary">{totalMessages}</span>
            <span className="text-[10px] text-slate-500">건</span>
          </div>
          {unreadMessages > 0 && (
            <p className="text-[10px] text-warning mt-0.5">{unreadMessages}건 미읽음</p>
          )}
        </div>

        {/* 성공률 */}
        <div className="p-3 bg-surface-container-high rounded-lg">
          <span className="text-[10px] text-slate-500 block mb-1">오늘 성공률</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold ${successRate >= 80 ? "text-tertiary" : successRate >= 50 ? "text-warning" : "text-error"}`}>
              {successRate}%
            </span>
            <span className="text-[10px] text-slate-500">{todayEvents}건</span>
          </div>
          {todayFails > 0 && (
            <p className="text-[10px] text-error mt-0.5">{todayFails}건 실패</p>
          )}
        </div>

        {/* 세션 */}
        <div className="p-3 bg-surface-container-high rounded-lg">
          <span className="text-[10px] text-slate-500 block mb-1">세션 기록</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-on-surface">{sessionCount}</span>
            <span className="text-[10px] text-slate-500">개</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
