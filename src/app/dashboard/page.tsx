import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { AutoRefresh } from "@/components/dashboard/AutoRefresh";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { FlowArrow } from "@/components/dashboard/FlowArrow";
import { HooksPipeline } from "@/components/dashboard/HooksPipeline";
import { GlobalStats } from "@/components/dashboard/GlobalStats";
import { ActiveAgentsGrid } from "@/components/dashboard/ActiveAgentsGrid";
import { SuccessRateChart } from "@/components/charts/SuccessRateChart";
import { HookBreakdownChart } from "@/components/charts/HookBreakdownChart";
import { LogTable } from "@/components/logs/LogTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { AGENTS } from "@/lib/constants/agents";
import { getSelectedProject } from "@/lib/env";
import { readDailyMetrics, summarizeEvents, getMetricsRange } from "@/lib/parsers/metrics-parser";
import { listSessionLogs } from "@/lib/parsers/session-parser";
import { listInboxMessages, getUnreadCounts } from "@/lib/parsers/message-parser";
import { readFile } from "fs/promises";
import { join } from "path";
import Link from "next/link";
import type { AgentStatus, AgentStatusType } from "@/types/agent";
import type { LogEntry } from "@/components/logs/LogRow";

export const dynamic = "force-dynamic";

function agentStatus(unread: number, lastMsg: string | null): AgentStatusType {
  if (unread > 0) return "alert";
  if (!lastMsg) return "idle";
  const m = (Date.now() - new Date(lastMsg).getTime()) / 60000;
  if (m < 1) return "processing";
  if (m < 30) return "success";
  return "idle";
}

async function fileExists(path: string): Promise<boolean> {
  try { await readFile(path); return true; } catch { return false; }
}

export default async function DashboardPage() {
  const projectRoot = await getSelectedProject();

  const [daily, trend, sessions, allMessages, unreadCounts] = await Promise.all([
    readDailyMetrics(projectRoot),
    getMetricsRange(projectRoot, 7),
    listSessionLogs(projectRoot, 10),
    listInboxMessages(projectRoot),
    getUnreadCounts(projectRoot),
  ]);

  const summary = daily && daily.events.length > 0 ? summarizeEvents(daily.events) : null;
  const totalFails = summary ? summary.failCount : 0;
  const unreadCount = allMessages.filter((m) => m.status === "unread").length;

  const lastActivity: Record<string, string> = {};
  for (const msg of allMessages) {
    if (!lastActivity[msg.to]) lastActivity[msg.to] = msg.timestamp;
  }

  const agents: AgentStatus[] = AGENTS.map((a) => ({
    ...a,
    status: agentStatus(unreadCounts[a.name] ?? 0, lastActivity[a.name] ?? null),
    unreadMessages: unreadCounts[a.name] ?? 0,
    lastActivity: lastActivity[a.name] ?? null,
    uptime: null,
  }));

  const activeCount = agents.filter((a) => a.status === "processing" || a.status === "success").length;
  const alertCount = agents.filter((a) => a.status === "alert").length;
  const alertMessages = allMessages.filter((m) => m.status === "unread" && (m.priority === "critical" || m.priority === "high"));
  const hasPatterns = await fileExists(join(projectRoot, ".claude", "memory", "patterns.md"));
  const hasData = trend.some((t) => t.summary.totalEvents > 0);

  const hookBreakdown = summary
    ? [
        { name: "Prettier", pass: summary.totalEvents - summary.prettierFail, fail: summary.prettierFail },
        { name: "ESLint", pass: summary.totalEvents - summary.eslintFail, fail: summary.eslintFail },
        { name: "TypeCheck", pass: summary.totalEvents - summary.typecheckFail, fail: summary.typecheckFail },
        { name: "Test", pass: summary.totalEvents - summary.testFail, fail: summary.testFail },
      ]
    : [];

  const eventLogs: LogEntry[] = (daily?.events ?? []).reverse().slice(0, 5).map((e, i) => ({
    id: `#HE-${String(i + 1).padStart(4, "0")}`,
    timestamp: e.timestamp,
    source: e.tool,
    action: e.file,
    status: e.results.prettier === "pass" && e.results.eslint === "pass" && e.results.typecheck === "pass" && e.results.test === "pass" ? "success" : "failed",
    duration: "-",
  }));

  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  return (
    <>
      {/* 타이틀 + 갱신 시간 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">
            <span className="text-primary">claude-builds</span> 대시보드
          </h1>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {projectRoot.split("/").pop()} · 마지막 갱신 {now}
          </p>
        </div>
        <AutoRefresh />
      </div>

      {/* 알림 */}
      <AlertBanner alerts={alertMessages} hookFails={totalFails} />

      {/* ═══════════════════════════════════════════
           상단: 아키텍처 흐름 — 한 줄 요약 카드
         ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-5 gap-2 mb-8">
        {[
          {
            num: "1", label: "Orchestration", icon: "account_tree", href: "/orchestrators",
            status: "idle" as const, text: "대기",
          },
          {
            num: "2", label: "Hooks (14)", icon: "bolt", href: "/hooks",
            status: (totalFails > 0 ? "error" : summary ? "active" : "idle") as "error" | "active" | "idle",
            text: totalFails > 0 ? `${totalFails} fail` : summary ? `${summary.successRate}%` : "대기",
          },
          {
            num: "3", label: "Agents (11)", icon: "smart_toy", href: "/agents",
            status: (alertCount > 0 ? "warn" : activeCount > 0 ? "active" : "idle") as "warn" | "active" | "idle",
            text: alertCount > 0 ? `${alertCount} 알림` : `${activeCount} 활성`,
          },
          {
            num: "4", label: "통신 버스", icon: "hub", href: "/bus",
            status: (unreadCount > 0 ? "warn" : allMessages.length > 0 ? "active" : "idle") as "warn" | "active" | "idle",
            text: unreadCount > 0 ? `${unreadCount} 미읽음` : `${allMessages.length}건`,
          },
          {
            num: "5", label: "학습 루프", icon: "psychology", href: "/learning",
            status: (hasPatterns ? "active" : "idle") as "active" | "idle",
            text: hasPatterns ? "학습 중" : "대기",
          },
        ].map((item) => {
          const colors = {
            active: "border-primary/30 bg-primary/5",
            error: "border-error/30 bg-error/5",
            warn: "border-warning/30 bg-warning/5",
            idle: "border-outline-variant/10",
          };
          const textColors = {
            active: "text-primary",
            error: "text-error",
            warn: "text-warning",
            idle: "text-slate-500",
          };
          return (
            <Link
              key={item.num}
              href={item.href}
              className={`glass rounded-xl border p-3 text-center transition-all hover:scale-[1.02] hover:shadow-lg ${colors[item.status]}`}
            >
              <MaterialIcon icon={item.icon} size="sm" className={textColors[item.status]} />
              <p className="text-[10px] font-bold text-on-surface mt-1">{item.label}</p>
              <p className={`text-[10px] font-bold mt-0.5 ${textColors[item.status]}`}>{item.text}</p>
            </Link>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════
           중단: 핵심 모니터링
         ═══════════════════════════════════════════ */}
      <SectionHeader
        number=""
        title="Claude Code CLI"
        badge="core"
        status={totalFails > 0 ? "error" : summary ? "active" : "idle"}
        statusText={totalFails > 0 ? `${totalFails}건 실패` : summary ? `${summary.successRate}% 성공` : "대기"}
        detail={summary ? `오늘 ${summary.totalEvents}건` : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <HooksPipeline summary={summary} />
        <GlobalStats
          activeAgents={activeCount}
          alertAgents={alertCount}
          totalAgents={AGENTS.length}
          unreadMessages={unreadCount}
          totalMessages={allMessages.length}
          todayEvents={summary?.totalEvents ?? 0}
          todayFails={totalFails}
          successRate={summary?.successRate ?? 0}
          sessionCount={sessions.length}
        />
      </div>

      {/* 에이전트 */}
      <ActiveAgentsGrid agents={agents} />

      {/* 차트 + 최근 로그 나란히 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {hasData ? (
          <SuccessRateChart
            data={trend.map((t) => ({ date: t.date, successRate: t.summary.successRate, totalEvents: t.summary.totalEvents }))}
          />
        ) : (
          <GlassCard className="p-6 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <MaterialIcon icon="bar_chart" size="xl" className="text-slate-600 mb-2" />
              <p className="text-sm">메트릭이 쌓이면 추이 차트가 표시됩니다</p>
            </div>
          </GlassCard>
        )}
        {hookBreakdown.length > 0 ? (
          <HookBreakdownChart data={hookBreakdown} />
        ) : (
          <GlassCard className="p-6 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <MaterialIcon icon="stacked_bar_chart" size="xl" className="text-slate-600 mb-2" />
              <p className="text-sm">훅 실행 결과가 쌓이면 분석 차트가 표시됩니다</p>
            </div>
          </GlassCard>
        )}
      </div>

      {/* 최근 활동 로그 (5건만) */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-sm font-bold text-on-surface">최근 활동</h3>
        <Link href="/logs" className="text-[10px] text-primary hover:underline flex items-center gap-1">
          전체 보기 <MaterialIcon icon="arrow_forward" size="xs" />
        </Link>
      </div>
      {eventLogs.length > 0 ? (
        <LogTable entries={eventLogs} />
      ) : (
        <GlassCard className="p-8 text-center text-slate-500">
          <MaterialIcon icon="history" size="xl" className="text-slate-600 mb-2" />
          <p className="text-sm">Claude Code로 파일을 수정하면 활동 로그가 기록됩니다</p>
        </GlassCard>
      )}
    </>
  );
}
